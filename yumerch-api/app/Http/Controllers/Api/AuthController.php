<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $data['username'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Username atau password salah.'], 422);
        }

        $user->api_token = Str::random(60);
        $user->save();

        return response()->json([
            'token' => $user->api_token,
            'user'  => [
                'id_user' => $user->id_user,
                'nama'    => $user->nama,
                'role'    => $user->role,
            ],
        ]);
    }

    public function me(Request $request)
    {
        $u = $request->user();
        return response()->json(['id_user' => $u->id_user, 'nama' => $u->nama, 'role' => $u->role]);
    }

    public function logout(Request $request)
    {
        $u = $request->user();
        $u->api_token = null;
        $u->save();
        return response()->json(['message' => 'Logout berhasil.']);
    }
}
