<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\FlightController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserAuthController;
use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Admin\FlightController as AdminFlightController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\OcrController;
use Illuminate\Support\Facades\Route;

// --- Public user flow ---
Route::get('/', [FlightController::class, 'index'])->name('home');
Route::get('/search', [FlightController::class, 'search'])->name('flights.search');

// --- Auth Flow ---
Route::get('/login', [UserAuthController::class, 'showLogin'])->name('login');
Route::post('/login', [UserAuthController::class, 'login'])->name('login.submit');
Route::post('/logout', [UserAuthController::class, 'logout'])->name('logout');

// --- Protected user flow ---
Route::middleware('auth')->group(function () {
    Route::get('/book', [OrderController::class, 'create'])->name('orders.create');
    Route::post('/book', [OrderController::class, 'store'])->name('orders.store');

    Route::get('/orders/{reference}/status', [OrderController::class, 'status'])->name('orders.status');
    Route::get('/orders/{reference}/download', [OrderController::class, 'download'])->name('orders.download');

    // My Bookings
    Route::get('/my-bookings', [BookingController::class, 'lookup'])->name('bookings.lookup');
    Route::get('/my-bookings/{reference}', [BookingController::class, 'show'])->name('bookings.show');
    Route::get('/my-bookings/{reference}/edit', [BookingController::class, 'edit'])->name('bookings.edit');
    Route::put('/my-bookings/{reference}', [BookingController::class, 'update'])->name('bookings.update');
    Route::get('/my-bookings/{reference}/download', [BookingController::class, 'download'])->name('bookings.download');

    // OCR
    Route::post('/ocr/scan', [OcrController::class, 'scan'])->name('ocr.scan');
});

// Skip payment routes for now
// Route::get('/orders/{reference}/payment', [OrderController::class, 'payment'])->name('orders.payment');
// Route::post('/orders/{reference}/payment', [OrderController::class, 'submitPayment'])->name('orders.payment.submit');

// --- Admin auth ---
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/', function () {
        if (auth()->check() && auth()->user()->is_admin) {
            return redirect()->route('admin.orders.index');
        }
        return redirect()->route('admin.login');
    });

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

        // Users
        Route::resource('users', AdminUserController::class);
    });
});
