<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'bill_id',
        'status',
        'owner_confirmation_token',
        'owner_confirmation_status',
        'owner_confirmation_requested_at',
        'owner_confirmation_at',
    ];

    protected $casts = [
        'owner_confirmation_requested_at' => 'datetime',
        'owner_confirmation_at' => 'datetime',
    ];

    public function bill()
    {
        return $this->belongsTo(Bill::class);
    }
}
