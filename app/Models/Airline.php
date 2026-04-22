<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Airline extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'name', 'logo_url', 'country', 'is_active'];

    public function flights()
    {
        return $this->hasMany(Flight::class);
    }
}
