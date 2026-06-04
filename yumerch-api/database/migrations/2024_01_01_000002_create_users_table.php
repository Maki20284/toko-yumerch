<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('users', function (Blueprint $t) {
            $t->id('id_user');
            $t->string('nama', 100);
            $t->string('username', 50)->unique();
            $t->string('password', 255);
            $t->enum('role', ['administrator', 'owner', 'staff']);
            $t->string('api_token', 80)->nullable()->index();
            $t->timestamp('created_at')->useCurrent();
        });
    }
    public function down(): void { Schema::dropIfExists('users'); }
};
