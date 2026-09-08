<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BoardingBranch extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'phone_number',
        'room_qty',
        'is_activated'
    ];

    public function residents(): HasMany
    {
        return $this->hasMany(Resident::class);
    }
    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class);
    }

    public function bills(): HasMany
    {
        return $this->hasMany(Bill::class);
    }

    public function punishments(): HasMany
    {
        return $this->hasMany(Punishment::class);
    }

    public function recordTransactions(): HasMany
    {
        return $this->hasMany(RecordTransaction::class);
    }
    public function items(): HasMany
    {
        return $this->hasMany(Item::class);
    }
}
