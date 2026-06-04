<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Barang;
use App\Models\Transaksi;

class TransaksiController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'id_barang'  => 'required|exists:barang,id_barang',
            'jenis'      => 'required|in:masuk,keluar',
            'jumlah'     => 'required|integer|min:1',
            'tanggal'    => 'required|date',
            'keterangan' => 'nullable|string|max:255',
        ]);

        $barang = Barang::findOrFail($data['id_barang']);

        if ($data['jenis'] === 'keluar' && $data['jumlah'] > $barang->stok) {
            return response()->json([
                'message' => "Stok tidak cukup. Stok {$barang->nama_barang} saat ini {$barang->stok}.",
            ], 422);
        }

        DB::transaction(function () use ($data, $request) {
            Transaksi::create([
                'id_barang'  => $data['id_barang'],
                'id_user'    => $request->user()->id_user,
                'jenis'      => $data['jenis'],
                'jumlah'     => $data['jumlah'],
                'tanggal'    => $data['tanggal'],
                'keterangan' => $data['keterangan'] ?? ($data['jenis'] === 'masuk' ? 'Barang masuk' : 'Barang keluar'),
            ]);

            $b = Barang::lockForUpdate()->find($data['id_barang']);
            $b->stok += $data['jenis'] === 'masuk' ? $data['jumlah'] : -$data['jumlah'];
            $b->status = $b->stok > 0 ? 'tersedia' : 'tidak_tersedia';
            $b->save();
        });

        return response()->json(['message' => 'Transaksi dicatat.'], 201);
    }
}
