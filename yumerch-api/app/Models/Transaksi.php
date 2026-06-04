<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model {
    protected $table = 'transaksi';
    protected $primaryKey = 'id_transaksi';
    public $timestamps = false;
    protected $fillable = ['id_barang', 'id_user', 'jenis', 'jumlah', 'tanggal', 'keterangan'];
    protected $casts = ['jumlah' => 'integer', 'id_barang' => 'integer', 'id_user' => 'integer'];

    public function barang() { return $this->belongsTo(Barang::class, 'id_barang', 'id_barang'); }
    public function user() { return $this->belongsTo(User::class, 'id_user', 'id_user'); }
}
