<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('flights', function (Blueprint $table) {
            $table->id();
            $table->foreignId('airline_id')->constrained()->cascadeOnDelete();
            $table->foreignId('origin_id')->constrained('airports')->cascadeOnDelete();
            $table->foreignId('destination_id')->constrained('airports')->cascadeOnDelete();
            $table->string('flight_number', 10);
            $table->string('aircraft_type')->nullable();
            $table->time('departure_time');
            $table->time('arrival_time');
            $table->unsignedTinyInteger('duration_hours');
            $table->unsignedTinyInteger('duration_minutes');
            $table->json('operates_on')->comment('Days of week: [0=Sun..6=Sat]');
            $table->string('cabin_class')->default('Economy');
            $table->string('source')->default('static'); // static | scraped
            $table->date('scraped_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flights');
    }
};
