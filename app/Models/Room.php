<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'number_room',
        'boarding_branch_id',
    ];

    protected $casts = [
        'number_room' => 'integer'
    ];
    public function boardingBranch(): BelongsTo
    {
        return $this->belongsTo(BoardingBranch::class);
    }

    public function residents(): HasMany
    {
        return $this->hasMany(Resident::class);
    }
}
