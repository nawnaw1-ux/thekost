<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BoardingService extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_qty',
    ];
}
