<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id', 'method', 'txn_id', 'sender_number', 'amount', 'status', 'verified_at',
    ];

    protected $casts = ['verified_at' => 'datetime'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
