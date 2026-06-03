<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::post(
    '/login',
    [AuthController::class,'login']
);

Route::middleware([
    'auth:sanctum',
    'role:owner'
])->group(function () {

    Route::apiResource(
        'users',
        UserController::class
    );

});

Route::middleware([
    'auth:sanctum',
    'role:owner,administrator'
])->group(function () {

    Route::post(
        '/barang',
        [BarangController::class,'store']
    );

    Route::put(
        '/barang/{id}',
        [BarangController::class,'update']
    );

    Route::delete(
        '/barang/{id}',
        [BarangController::class,'destroy']
    );

});

Route::middleware('auth:sanctum')
->get('/barang',
[BarangController::class,'index']);

Route::get('/barang/{id}',
[KategoriController::class,'show']);

Route::middleware([
    'auth:sanctum',
    'role:owner,administrator'
])->group(function () {

    Route::post(
        '/kategori',
        [KategoriController::class,'store']
    );

    Route::put(
        '/kategori/{id}',
        [KategoriController::class,'update']
    );

    Route::delete(
        '/kategori/{id}',
        [KategoriController::class,'destroy']
    );

});

Route::get('/transaksi',
[TransaksiController::class,'index']);

Route::post('/transaksi',
[TransaksiController::class,'store']);