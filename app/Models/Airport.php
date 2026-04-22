<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Airport extends Model
{
    use HasFactory;

    protected $fillable = ['iata_code', 'name', 'city', 'country', 'timezone'];

    public function originFlights()
    {
        return $this->hasMany(Flight::class, 'origin_id');
    }

    public function destinationFlights()
    {
        return $this->hasMany(Flight::class, 'destination_id');
    }
}
