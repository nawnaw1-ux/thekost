<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailBill extends Model
{
    use HasFactory;

    protected $fillable = [
        'bill_id',
        'name',
        'price',
    ];

    public function bill()
    {
        return $this->belongsTo(Bill::class);
    }

    public function temporaryBill()
    {
        return $this->belongsTo(BillTemporary::class);
    }
}
