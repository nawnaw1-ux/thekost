<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use RuntimeException;

class Bill extends Model
{
    use HasFactory;

    protected $fillable = [
        'resident_id',
        'amount',
        'invoice',
        'status',
        'boarding_branch_id',
        'end_date',
        'date_invoice',
        'date_pay',
        'penalty',
        'penalty_day',
        'unique_code',
        'transfer_amount',
    ];

    protected $casts = [
        'unique_code' => 'integer',
        'transfer_amount' => 'integer',
    ];

    protected static function booted(): void
    {
        static::creating(function (Bill $bill) {
            if (!$bill->unique_code || static::isUniqueCodeTaken($bill->unique_code, $bill->id)) {
                $bill->unique_code = static::generateUniqueCode($bill->id);
            }

            $bill->transfer_amount = static::calculateTransferAmount(
                $bill->amount,
                $bill->penalty,
                $bill->unique_code
            );
        });

        static::updating(function (Bill $bill) {
            if (!$bill->unique_code || static::isUniqueCodeTaken($bill->unique_code, $bill->id)) {
                $bill->unique_code = static::generateUniqueCode($bill->id);
            }

            if ($bill->isDirty(['amount', 'penalty', 'unique_code'])) {
                $bill->transfer_amount = static::calculateTransferAmount(
                    $bill->amount,
                    $bill->penalty,
                    $bill->unique_code
                );
            }
        });
    }

    public function ensurePaymentCode(): self
    {
        $calculatedTransferAmount = static::calculateTransferAmount(
            $this->amount,
            $this->penalty,
            $this->unique_code
        );

        $needsUniqueCode = !$this->unique_code
            || static::isUniqueCodeTaken($this->unique_code, $this->id);

        if ($needsUniqueCode) {
            $this->unique_code = static::generateUniqueCode($this->id);
            $calculatedTransferAmount = static::calculateTransferAmount(
                $this->amount,
                $this->penalty,
                $this->unique_code
            );
        }

        if ($this->transfer_amount !== $calculatedTransferAmount) {
            $this->transfer_amount = $calculatedTransferAmount;
        }

        if ($this->isDirty(['unique_code', 'transfer_amount'])) {
            $this->saveQuietly();
        }

        return $this;
    }

    public static function calculateTransferAmount(
        int|string|null $amount,
        int|string|null $penalty,
        int|string|null $uniqueCode
    ): int {
        return (int) $amount + (int) $penalty + (int) $uniqueCode;
    }

    protected static function generateUniqueCode(?int $ignoreBillId = null): int
    {
        $usedCodes = static::query()
            ->when($ignoreBillId, fn($query) => $query->whereKeyNot($ignoreBillId))
            ->whereNotNull('unique_code')
            ->pluck('unique_code')
            ->map(fn($code) => (int) $code)
            ->unique()
            ->values()
            ->all();

        $availableCodes = array_values(array_diff(range(1, 999), $usedCodes));

        if ($availableCodes === []) {
            throw new RuntimeException('Semua kode unik tagihan sudah terpakai.');
        }

        return $availableCodes[array_rand($availableCodes)];
    }

    protected static function isUniqueCodeTaken(int|string|null $uniqueCode, ?int $ignoreBillId = null): bool
    {
        if (!$uniqueCode) {
            return false;
        }

        return static::query()
            ->when($ignoreBillId, fn($query) => $query->whereKeyNot($ignoreBillId))
            ->where('unique_code', (int) $uniqueCode)
            ->exists();
    }

    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }

    public function boardingBranch()
    {
        return $this->belongsTo(BoardingBranch::class);
    }
    public function detailBills()
    {
        return $this->hasMany(DetailBill::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}
