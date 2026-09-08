<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Punishment extends Model
{
    use HasFactory;

    protected $fillable = [
        'price',
        'boarding_branch_id',
        'max_day'
    ];

    public function boardingBranch()
    {
        return $this->belongsTo(BoardingBranch::class);
    }
}
