<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('barang', function (Blueprint $t) {
            $t->id('id_barang');
            $t->string('kode_barang', 30)->unique();
            $t->string('nama_barang', 150);
            $t->unsignedBigInteger('id_kategori');
            $t->decimal('harga', 12, 2)->default(0);
            $t->integer('stok')->default(0);
            $t->string('gambar', 255)->nullable();
            $t->enum('status', ['tersedia', 'tidak_tersedia'])->default('tidak_tersedia');
            $t->timestamp('created_at')->useCurrent();
            $t->foreign('id_kategori')->references('id_kategori')->on('kategori')->onUpdate('cascade');
        });
    }
    public function down(): void { Schema::dropIfExists('barang'); }
};
