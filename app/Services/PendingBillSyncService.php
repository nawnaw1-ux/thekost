<?php

namespace App\Services;

use App\Models\Bill;
use App\Models\DetailBill;
use App\Models\Payment;
use App\Models\ResidentNeed;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Sinkronisasi tagihan pending terhadap Keperluan (resident_needs +
 * items) terkini. Dipakai oleh:
 *  - Admin\UserNeedController  (Keperluan resident berubah)
 *  - Admin\ItemController      (harga/nama item — termasuk harga kamar — berubah)
 *  - Console\Commands\SyncPendingBill (perintah manual per-invoice)
 *
 * Kebijakan (hasil audit Langkah 1 + 2):
 *  - Bill 'lunas' TIDAK PERNAH disentuh (immutable / integritas riwayat).
 *  - Bill non-aktif (status_active != '1') tidak disentuh.
 *  - Bill TELAT (end_date < hari ini) di-skip untuk sementara (kebijakan
 *    Langkah 1; menyusul keputusan terpisah).
 *  - Bill dengan link pembayaran Xendit belum selesai (payments.status
 *    != 'lunas') di-skip: amount di sisi Xendit sudah dibekukan, butuh
 *    keputusan expire/recreate.
 *  - Resident tanpa Keperluan aktif di-skip (mencegah amount jadi 0).
 */
class PendingBillSyncService
{
    /** Kategori ringkasan hasil sync. */
    public static function emptySummary(): array
    {
        return [
            'synced'           => [], // bill di-rebuild (nilai berubah)
            'unchanged'        => [], // bill diperiksa, sudah sesuai
            'skipped_inactive' => [],
            'skipped_lunas'    => [],
            'skipped_overdue'  => [],
            'skipped_payment'  => [],
            'skipped_no_needs' => [],
        ];
    }

    /**
     * Sync semua tagihan pending milik satu penghuni.
     */
    public static function syncResidentBills(int $residentId): array
    {
        $summary = self::emptySummary();

        $bills = Bill::with('detailBills')
            ->where('resident_id', $residentId)
            ->where('status', '!=', 'lunas')
            ->where('status_active', '1')
            ->orderBy('end_date')
            ->get();

        foreach ($bills as $bill) {
            $reason = self::guardReason($bill);
            if ($reason !== null) {
                $summary[$reason][] = $bill->invoice;
                continue;
            }
            $summary[self::syncBill($bill)][] = $bill->invoice;
        }

        return $summary;
    }

    /**
     * Sync tagihan pending semua penghuni yang memakai item ini.
     * Dipakai saat harga/nama item (termasuk harga kamar) diubah.
     */
    public static function syncBillsForItem(int $itemId): array
    {
        $summary = self::emptySummary();

        $residentIds = ResidentNeed::where('item_id', $itemId)
            ->pluck('resident_id')
            ->unique()
            ->all();

        foreach ($residentIds as $residentId) {
            $partial = self::syncResidentBills((int) $residentId);
            foreach ($partial as $key => $invoices) {
                $summary[$key] = array_merge($summary[$key], $invoices);
            }
        }

        return $summary;
    }

    /**
     * Alasan sebuah bill TIDAK boleh/boleh disync.
     * Null = aman untuk disync.
     */
    public static function guardReason(Bill $bill): ?string
    {
        if ((string) $bill->status_active !== '1') {
            return 'skipped_inactive';
        }
        if ($bill->status === 'lunas') {
            return 'skipped_lunas';
        }
        if (Carbon::parse($bill->end_date)->lt(Carbon::today())) {
            return 'skipped_overdue';
        }
        if (Payment::where('bill_id', $bill->id)->where('status', '!=', 'lunas')->exists()) {
            return 'skipped_payment';
        }
        if (!ResidentNeed::where('resident_id', $bill->resident_id)->exists()) {
            return 'skipped_no_needs';
        }
        return null;
    }

    /**
     * Rebuild detail_bills + amount SATU bill dari Keperluan terkini.
     * Return 'synced' (nilai berubah) atau 'unchanged' (sudah sesuai).
     * Pemanggil WAJIB memanggil guardReason() lebih dulu — di sini guard
     * tidak diulang supaya pesan skip tidak terpotong per-bill.
     */
    public static function syncBill(Bill $bill): string
    {
        $needs = ResidentNeed::with('item')
            ->where('resident_id', $bill->resident_id)
            ->get();

        $newItems = $needs->map(fn ($need) => [
            'name'  => $need->item->name,
            'price' => (int) $need->item->price,
        ])->all();
        $newAmount = array_sum(array_column($newItems, 'price'));

        $oldItems = $bill->detailBills
            ->map(fn ($d) => ['name' => $d->name, 'price' => (int) $d->price])
            ->all();

        if ((int) $bill->amount === $newAmount && $oldItems == $newItems) {
            return 'unchanged';
        }

        $oldAmount = (int) $bill->amount;

        DB::transaction(function () use ($bill, $newItems, $newAmount) {
            DetailBill::where('bill_id', $bill->id)->delete();

            foreach ($newItems as $item) {
                $bill->detailBills()->create([
                    'bill_id' => $bill->id,
                    'name'    => $item['name'],
                    'price'   => $item['price'],
                ]);
            }

            $bill->amount = $newAmount;
            $bill->save();
        });

        Log::info("PendingBillSync | Bill #{$bill->id} ({$bill->invoice}) disync: Rp{$oldAmount} → Rp{$newAmount}, item " . count($oldItems) . ' → ' . count($newItems));

        return 'synced';
    }

    /**
     * Ringkasan hasil sync jadi kalimat pendek untuk flash message admin.
     * Return null kalau tidak ada yang perlu dilaporkan.
     */
    public static function describeSummary(array $summary): ?string
    {
        $parts = [];
        if ($summary['synced']) {
            $parts[] = count($summary['synced']) . ' tagihan pending otomatis di-update';
        }
        if ($summary['skipped_overdue']) {
            $parts[] = count($summary['skipped_overdue']) . ' tagihan telat dilewati';
        }
        if ($summary['skipped_payment']) {
            $parts[] = count($summary['skipped_payment']) . ' tagihan ditunda (ada link pembayaran aktif)';
        }

        return $parts ? implode(', ', $parts) . '.' : null;
    }
}
