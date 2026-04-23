<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference', 'flight_id', 'user_id', 'travel_date', 'contact_name',
        'contact_email', 'contact_phone', 'status', 'pdf_path', 'admin_note',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected $casts = ['travel_date' => 'date'];

    public function flight()
    {
        return $this->belongsTo(Flight::class);
    }

    public function passengers()
    {
        return $this->hasMany(Passenger::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}
