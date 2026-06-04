<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;

class ApiAuth
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();
        $user = $token ? User::where('api_token', $token)->first() : null;

        if (!$user) {
            return response()->json(['message' => 'Tidak terautentikasi.'], 401);
        }

        $request->setUserResolver(fn () => $user);
        return $next($request);
    }
}
