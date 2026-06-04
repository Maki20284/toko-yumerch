<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Barang extends Model {
    protected $table = 'barang';
    protected $primaryKey = 'id_barang';
    public $timestamps = false;
    protected $fillable = ['kode_barang', 'nama_barang', 'id_kategori', 'harga', 'stok', 'gambar', 'status'];
    protected $casts = ['harga' => 'float', 'stok' => 'integer', 'id_kategori' => 'integer'];

    public function kategori() { return $this->belongsTo(Kategori::class, 'id_kategori', 'id_kategori'); }
}
