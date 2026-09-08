<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Resident extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'gender',
        'phone_number',
        'room_id',
        'boarding_branch_id',
        'number_plat',
        'status_active',
        'tanggal_keluar',
        'tanggal_masuk',
    ];


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }


    public function needs(): HasMany
    {
        return $this->hasMany(ResidentNeed::class);
    }

    public function bills()
    {
        return $this->hasMany(Bill::class);
    }

    public function temporaryBills()
    {
        return $this->hasMany(BillTemporary::class);
    }

    public function boardingBranch(): BelongsTo
    {
        return $this->belongsTo(BoardingBranch::class);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }
}
