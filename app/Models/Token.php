<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Token extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'token',
        'user_id',
        'expires_at',
        'status_usage',
        'expires_status_usage_at'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
