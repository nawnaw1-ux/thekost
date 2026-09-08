<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'boarding_branch_id'
    ];

    public function needs()
    {
        return $this->hasMany(ResidentNeed::class);
    }
    public function boardingBranch(): BelongsTo
    {
        return $this->belongsTo(BoardingBranch::class);
    }
}
