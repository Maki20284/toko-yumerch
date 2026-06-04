<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('kategori', function (Blueprint $t) {
            $t->id('id_kategori');
            $t->string('nama_kategori', 80);
            $t->text('deskripsi')->nullable();
        });
    }
    public function down(): void { Schema::dropIfExists('kategori'); }
};
