<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Passenger extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id', 'type', 'title', 'first_name', 'last_name',
        'date_of_birth', 'nationality', 'passport_number', 'passport_expiry',
    ];

    protected $casts = [
        'date_of_birth'   => 'date',
        'passport_expiry' => 'date',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
