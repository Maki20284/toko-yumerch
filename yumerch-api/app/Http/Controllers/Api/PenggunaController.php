<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class PenggunaController extends Controller
{
    private function guardOwner(Request $request)
    {
        if ($request->user()->role !== 'owner') {
            abort(403, 'Hanya owner yang dapat mengelola pengguna.');
        }
    }

    public function index(Request $request)
    {
        $this->guardOwner($request);
        return response()->json(User::orderBy('id_user')->get(['id_user', 'nama', 'username', 'role']));
    }

    public function store(Request $request)
    {
        $this->guardOwner($request);
        $data = $request->validate([
            'nama'     => 'required|string|max:100',
            'username' => 'required|string|max:50|unique:users,username',
            'password' => 'required|string|min:5',
            'role'     => 'required|in:administrator,owner,staff',
        ]);
        $data['password'] = Hash::make($data['password']);
        $u = User::create($data);
        return response()->json(['id_user' => $u->id_user, 'nama' => $u->nama, 'username' => $u->username, 'role' => $u->role], 201);
    }

    public function update(Request $request, $id)
    {
        $this->guardOwner($request);
        $u = User::findOrFail($id);
        $data = $request->validate([
            'nama'     => 'required|string|max:100',
            'username' => 'required|string|max:50|unique:users,username,' . $id . ',id_user',
            'password' => 'nullable|string|min:5',
            'role'     => 'required|in:administrator,owner,staff',
        ]);
        if (!empty($data['password'])) $data['password'] = Hash::make($data['password']);
        else unset($data['password']);
        $u->update($data);
        return response()->json(['id_user' => $u->id_user, 'nama' => $u->nama, 'username' => $u->username, 'role' => $u->role]);
    }

    public function destroy(Request $request, $id)
    {
        $this->guardOwner($request);
        if ((int) $id === (int) $request->user()->id_user) {
            return response()->json(['message' => 'Tidak bisa menghapus akun yang sedang dipakai.'], 422);
        }
        User::findOrFail($id)->delete();
        return response()->json(['message' => 'Pengguna dihapus.']);
    }
}
