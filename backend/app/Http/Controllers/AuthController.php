<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Handle login request
     */
    public function login(Request $request)
    {
        $request->validate([
            'akun_sso' => 'required|string',
            'password' => 'required|string',
        ], [
            'akun_sso.required' => 'Akun SSO harus diisi',
            'password.required' => 'Kata sandi harus diisi',
        ]);

        // Cari user berdasarkan email atau NIP
        $user = User::where('email', $request->akun_sso)
            ->orWhere('nip', $request->akun_sso)
            ->first();

        // Validasi kredensial
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Akun SSO atau kata sandi salah',
                'errors' => [
                    'akun_sso' => ['Akun SSO atau kata sandi salah']
                ]
            ], 401);
        }

        // Cek apakah akun aktif
        if (!$user->isActive()) {
            return response()->json([
                'message' => 'Akun Anda tidak aktif. Silakan hubungi administrator.',
                'errors' => [
                    'akun_sso' => ['Akun tidak aktif']
                ]
            ], 403);
        }

        // Login user
        Auth::login($user, $request->boolean('remember'));

        // Regenerate session
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Login berhasil',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'redirect' => $user->isAdmin() ? '/admin' : '/staff',
        ]);
    }

    /**
     * Handle logout request
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logout berhasil',
            'redirect' => '/login',
        ]);
    }

    /**
     * Get authenticated user
     */
    public function user(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'nip' => $user->nip,
                'role' => $user->role,
                'is_active' => $user->is_active,
            ]
        ]);
    }
}
