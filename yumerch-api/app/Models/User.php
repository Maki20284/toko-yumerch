<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class User extends Model {
    protected $table = 'users';
    protected $primaryKey = 'id_user';
    public $timestamps = false;
    protected $fillable = ['nama', 'username', 'password', 'role', 'api_token'];
    protected $hidden = ['password', 'api_token'];
}
