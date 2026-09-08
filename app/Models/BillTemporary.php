<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BillTemporary extends Model
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
        'detail_bills',
        'status_active',
    ];

    protected $casts = [
        'detail_bills' => 'array',
    ];

    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }

    public function boardingBranch()
    {
        return $this->belongsTo(BoardingBranch::class);
    }
}
