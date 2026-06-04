<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Barang;

class BarangController extends Controller
{
    private function guardWrite(Request $request)
    {
        if ($request->user()->role === 'staff') {
            abort(403, 'Anda tidak punya akses.');
        }
    }

    private function rules($id = null): array
    {
        return [
            'kode_barang' => 'required|string|max:30|unique:barang,kode_barang,' . ($id ?? 'NULL') . ',id_barang',
            'nama_barang' => 'required|string|max:150',
            'id_kategori' => 'required|exists:kategori,id_kategori',
            'harga'       => 'required|numeric|min:0',
            'stok'        => 'required|integer|min:0',
            'gambar'      => 'nullable|string|max:255',
        ];
    }

    public function store(Request $request)
    {
        $this->guardWrite($request);
        $data = $request->validate($this->rules());
        $data['status'] = $data['stok'] > 0 ? 'tersedia' : 'tidak_tersedia';
        $b = Barang::create($data);
        return response()->json($b, 201);
    }

    public function update(Request $request, $id)
    {
        $this->guardWrite($request);
        $b = Barang::findOrFail($id);
        $data = $request->validate($this->rules($id));
        $data['status'] = $data['stok'] > 0 ? 'tersedia' : 'tidak_tersedia';
        $b->update($data);
        return response()->json($b);
    }

    public function destroy(Request $request, $id)
    {
        $this->guardWrite($request);
        Barang::findOrFail($id)->delete();
        return response()->json(['message' => 'Barang dihapus.']);
    }
}
