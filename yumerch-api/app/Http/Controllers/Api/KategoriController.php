<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Kategori;

class KategoriController extends Controller
{
    private function guardWrite(Request $request)
    {
        // staff tidak boleh menulis
        if ($request->user()->role === 'staff') {
            abort(403, 'Anda tidak punya akses.');
        }
    }

    public function store(Request $request)
    {
        $this->guardWrite($request);
        $data = $request->validate([
            'nama_kategori' => 'required|string|max:80',
            'deskripsi'     => 'nullable|string',
        ]);
        $k = Kategori::create($data);
        return response()->json($k, 201);
    }

    public function update(Request $request, $id)
    {
        $this->guardWrite($request);
        $k = Kategori::findOrFail($id);
        $data = $request->validate([
            'nama_kategori' => 'required|string|max:80',
            'deskripsi'     => 'nullable|string',
        ]);
        $k->update($data);
        return response()->json($k);
    }

    public function destroy(Request $request, $id)
    {
        $this->guardWrite($request);
        $k = Kategori::findOrFail($id);
        if ($k->barang()->exists()) {
            return response()->json(['message' => 'Kategori masih dipakai oleh barang.'], 422);
        }
        $k->delete();
        return response()->json(['message' => 'Kategori dihapus.']);
    }
}
