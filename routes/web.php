<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\FlightController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Admin\FlightController as AdminFlightController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use Illuminate\Support\Facades\Route;

// --- Public user flow ---
Route::get('/', [FlightController::class, 'index'])->name('home');
Route::get('/search', [FlightController::class, 'search'])->name('flights.search');

Route::get('/book', [OrderController::class, 'create'])->name('orders.create');
Route::post('/book', [OrderController::class, 'store'])->name('orders.store');

Route::get('/orders/{reference}/payment', [OrderController::class, 'payment'])->name('orders.payment');
Route::post('/orders/{reference}/payment', [OrderController::class, 'submitPayment'])->name('orders.payment.submit');

Route::get('/orders/{reference}/status', [OrderController::class, 'status'])->name('orders.status');
Route::get('/orders/{reference}/download', [OrderController::class, 'download'])->name('orders.download');

// --- My Bookings (lookup by email) ---
Route::get('/my-bookings', [BookingController::class, 'lookup'])->name('bookings.lookup');
Route::post('/my-bookings', [BookingController::class, 'search'])->name('bookings.search');
Route::get('/my-bookings/{reference}', [BookingController::class, 'show'])->name('bookings.show');
Route::get('/my-bookings/{reference}/edit', [BookingController::class, 'edit'])->name('bookings.edit');
Route::put('/my-bookings/{reference}', [BookingController::class, 'update'])->name('bookings.update');
Route::get('/my-bookings/{reference}/download', [BookingController::class, 'download'])->name('bookings.download');

// --- Admin auth ---
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AdminAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AdminAuthController::class, 'login'])->name('login.submit');
    Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');

    // Protected admin routes
    Route::middleware(\App\Http\Middleware\EnsureAdmin::class)->group(function () {
        // Orders
        Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
        Route::get('/orders/{order}/edit', [AdminOrderController::class, 'edit'])->name('orders.edit');
        Route::put('/orders/{order}', [AdminOrderController::class, 'update'])->name('orders.update');
        Route::post('/orders/{order}/approve', [AdminOrderController::class, 'approve'])->name('orders.approve');
        Route::post('/orders/{order}/reject', [AdminOrderController::class, 'reject'])->name('orders.reject');
        Route::get('/orders/{order}/download', [AdminOrderController::class, 'download'])->name('orders.download');

        // Flights
        Route::get('/flights', [AdminFlightController::class, 'index'])->name('flights.index');
        Route::post('/flights/{flight}/toggle', [AdminFlightController::class, 'toggleActive'])->name('flights.toggle');
        Route::post('/flights/sync', [AdminFlightController::class, 'sync'])->name('flights.sync');
    });
});
