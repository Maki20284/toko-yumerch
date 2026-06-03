<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $user = User::where(
            'username',
            $request->username
        )->first();

        if (!$user)
        {
            return response()->json([
                'message' => 'Username salah'
            ],401);
        }

        if ($request->password != $user->password)
        {
            return response()->json([
                'message' => 'Password salah'
            ],401);
        }

        $token = $user
            ->createToken('auth')
            ->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user
        ]);
    }
}
