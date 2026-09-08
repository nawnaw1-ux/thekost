<?php

namespace App\Console\Commands;

use App\Models\Bill;
use App\Models\Payment;
use App\Services\PendingBillSyncService;
use App\Models\ResidentNeed;
use Illuminate\Console\Command;

/**
 * Sync satu tagihan (bill) yang masih pending terhadap Keperluan
 * (resident_needs) terkini milik penghuni terkait.
 *
 * Guard & proses rebuild ada di App\Services\PendingBillSyncService
 * (shared dengan hook otomatis di UserNeedController / ItemController).
 * Command ini hanya membungkusnya dengan preview + konfirmasi manual.
 */
class SyncPendingBill extends Command
{
    protected $signature = 'bills:sync-pending
        {invoice : Nomor invoice (exact match kolom bills.invoice)}';

    protected $description = 'Rebuild detail_bills + amount satu tagihan pending berdasarkan Keperluan (resident_needs) terkini';

    public function handle(): int
    {
        $invoiceNumber = $this->argument('invoice');

        $bill = Bill::with('detailBills')
            ->where('invoice', $invoiceNumber)
            ->first();

        if (!$bill) {
            $this->error("Tagihan dengan invoice '{$invoiceNumber}' tidak ditemukan (pencarian exact match).");
            return self::FAILURE;
        }

        // ---- Guard (logika di service, supaya konsisten dengan hook) ----
        $reason = PendingBillSyncService::guardReason($bill);

        switch ($reason) {
            case 'skipped_inactive':
                $this->error("Tagihan ini berstatus non-aktif (status_active = '{$bill->status_active}'), tidak boleh di-sync.");
                return self::FAILURE;

            case 'skipped_lunas':
                $this->error("Tagihan ini sudah LUNAS (immutable snapshot untuk integritas riwayat pembayaran). Tidak di-sync.");
                return self::FAILURE;

            case 'skipped_overdue':
                $this->warn('Tagihan ini SUDAH TELAT (end_date ' . $bill->end_date . ' < hari ini).');
                $this->warn('Kebijakan Langkah 1: bill telat TIDAK ikut di-sync. Kasus ini ditangani terpisah.');
                return self::FAILURE;

            case 'skipped_payment':
                $this->error('SYNC DIBATALKAN: tagihan ini punya link pembayaran Xendit yang belum selesai (amount di sisi Xendit sudah dibekukan dengan nilai lama).');
                $activePayments = Payment::where('bill_id', $bill->id)
                    ->where('status', '!=', 'lunas')
                    ->get();
                $this->table(
                    ['payment_id', 'external_id', 'status', 'checkout_link', 'created_at'],
                    $activePayments->map(fn ($p) => [
                        $p->id,
                        $p->external_id ?? '-',
                        $p->status,
                        $p->checkout_link ?? '-',
                        $p->created_at,
                    ])->all()
                );
                $this->line('Keputusan tambahan diperlukan: expire link Xendit lama + buat ulang setelah sync, atau biarkan tagihan ini tidak di-sync.');
                return self::FAILURE;

            case 'skipped_no_needs':
                $this->error('Penghuni tidak punya Keperluan aktif (resident_needs kosong). Sync dibatalkan agar amount tidak menjadi 0.');
                return self::FAILURE;
        }

        // ---- Hitung kondisi baru untuk preview ----
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

        // ---- Kondisi berhenti dini: tidak ada perubahan ----
        if ((int) $bill->amount === $newAmount && $oldItems == $newItems) {
            $this->info('Tidak ada perubahan: detail_bills dan amount sudah sesuai Keperluan terkini. Tidak ada yang dieksekusi.');
            return self::SUCCESS;
        }

        // ---- Preview SEBELUM commit ----
        $this->info('════════════════════════════════════════════════════');
        $this->info(' PREVIEW SYNC — belum ada data yang diubah');
        $this->info('════════════════════════════════════════════════════');
        $this->line(" Invoice      : {$bill->invoice}");
        $this->line(" Bill ID      : {$bill->id}");
        $this->line(" Resident ID  : {$bill->resident_id}");
        $this->line(" Status       : {$bill->status} | end_date: {$bill->end_date} | penalty: {$bill->penalty}");
        $this->newLine();

        $this->table(
            ['#', 'Item (LAMA)', 'Harga (LAMA)', 'Item (BARU)', 'Harga (BARU)'],
            $this->zipRows($oldItems, $newItems)
        );
        $this->newLine();
        $this->line(' Jumlah item : ' . count($oldItems) . '  →  ' . count($newItems));
        $this->line(' Total amount: Rp' . number_format((float) $bill->amount, 0, ',', '.') . '  →  Rp' . number_format((float) $newAmount, 0, ',', '.'));
        $this->newLine();

        if (!$this->confirm('Rebuild detail_bills + amount tagihan ini sesuai preview di atas?')) {
            $this->warn('Dibatalkan. Tidak ada data yang diubah.');
            return self::SUCCESS;
        }

        $oldAmount = (int) $bill->amount;

        // ---- Eksekusi (guard + rebuild di service) ----
        $result = PendingBillSyncService::syncBill($bill);

        if ($result !== 'synced') {
            $this->info('Tidak ada perubahan yang perlu disimpan.');
            return self::SUCCESS;
        }

        $this->newLine();
        $this->info('✓ Sync selesai (committed).');
        $this->line('  amount      : Rp' . number_format((float) $oldAmount, 0, ',', '.') . '  →  Rp' . number_format((float) $newAmount, 0, ',', '.'));
        $this->line('  Item        : ' . count($oldItems) . '  →  ' . count($newItems));
        $this->line('  Silakan verifikasi di admin panel (Detail Penghuni vs halaman Tagihan).');

        return self::SUCCESS;
    }

    /**
     * Gabungkan baris lama & baru jadi satu tabel preview berdampingan.
     */
    private function zipRows(array $old, array $new): array
    {
        $max = max(count($old), count($new));
        $rows = [];
        for ($i = 0; $i < $max; $i++) {
            $rows[] = [
                $i + 1,
                $old[$i]['name']  ?? '—',
                isset($old[$i]['price']) ? number_format((float) $old[$i]['price'], 0, ',', '.') : '—',
                $new[$i]['name']  ?? '—',
                isset($new[$i]['price']) ? number_format((float) $new[$i]['price'], 0, ',', '.') : '—',
            ];
        }
        return $rows;
    }
}
