<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Kategori;
use App\Models\Barang;
use App\Models\Transaksi;
use App\Models\User;

class DataController extends Controller
{
    // Satu endpoint untuk memuat seluruh data yang dibutuhkan frontend
    public function bootstrap(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'kategori'  => Kategori::orderBy('id_kategori')->get(),
            'barang'    => Barang::orderBy('id_barang')->get(),
            'transaksi' => Transaksi::orderBy('id_transaksi')->get(),
            // daftar pengguna hanya untuk owner
            'users'     => $user->role === 'owner'
                ? User::orderBy('id_user')->get(['id_user', 'nama', 'username', 'role'])
                : [],
        ]);
    }
}
