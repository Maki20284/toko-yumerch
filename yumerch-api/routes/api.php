<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\ApiAuth;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DataController;
use App\Http\Controllers\Api\KategoriController;
use App\Http\Controllers\Api\BarangController;
use App\Http\Controllers\Api\PenggunaController;
use App\Http\Controllers\Api\TransaksiController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware(ApiAuth::class)->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/bootstrap', [DataController::class, 'bootstrap']);

    Route::post('/kategori', [KategoriController::class, 'store']);
    Route::put('/kategori/{id}', [KategoriController::class, 'update']);
    Route::delete('/kategori/{id}', [KategoriController::class, 'destroy']);

    Route::post('/barang', [BarangController::class, 'store']);
    Route::put('/barang/{id}', [BarangController::class, 'update']);
    Route::delete('/barang/{id}', [BarangController::class, 'destroy']);

    Route::get('/users', [PenggunaController::class, 'index']);
    Route::post('/users', [PenggunaController::class, 'store']);
    Route::put('/users/{id}', [PenggunaController::class, 'update']);
    Route::delete('/users/{id}', [PenggunaController::class, 'destroy']);

    Route::post('/transaksi', [TransaksiController::class, 'store']);
});
