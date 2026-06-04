<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('transaksi', function (Blueprint $t) {
            $t->id('id_transaksi');
            $t->unsignedBigInteger('id_barang');
            $t->unsignedBigInteger('id_user');
            $t->enum('jenis', ['masuk', 'keluar']);
            $t->integer('jumlah');
            $t->date('tanggal');
            $t->string('keterangan', 255)->nullable();
            $t->timestamp('created_at')->useCurrent();
            $t->foreign('id_barang')->references('id_barang')->on('barang')->onDelete('cascade')->onUpdate('cascade');
            $t->foreign('id_user')->references('id_user')->on('users')->onUpdate('cascade');
        });
    }
    public function down(): void { Schema::dropIfExists('transaksi'); }
};
