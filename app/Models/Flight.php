<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Flight extends Model
{
    use HasFactory;

    protected $fillable = [
        'airline_id', 'origin_id', 'destination_id', 'flight_number',
        'aircraft_type', 'departure_time', 'arrival_time',
        'duration_hours', 'duration_minutes', 'operates_on',
        'cabin_class', 'source', 'scraped_at', 'is_active',
    ];

    protected $casts = [
        'operates_on' => 'array',
        'scraped_at'  => 'date',
        'is_active'   => 'boolean',
    ];

    public function airline()
    {
        return $this->belongsTo(Airline::class);
    }

    public function origin()
    {
        return $this->belongsTo(Airport::class, 'origin_id');
    }

    public function destination()
    {
        return $this->belongsTo(Airport::class, 'destination_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function operatesOn(int $dayOfWeek): bool
    {
        return in_array($dayOfWeek, $this->operates_on ?? []);
    }
}
