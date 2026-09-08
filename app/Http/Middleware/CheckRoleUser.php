<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRoleUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $role = null): Response
    {
        // Jika pengguna tidak login, izinkan akses ke '/' dan '/login'
        if (!$request->user()) {
            return $next($request);
        }

        // Jika pengguna sudah login dan mencoba mengakses '/' atau '/login', redirect ke dashboard sesuai role
        if (in_array($request->path(), ['/'])) {
            switch ($request->user()->role) {
                case 'resident':
                    return redirect('/dashboard');
                case 'admin':
                    return redirect('/admin/dashboard');
            }
        }

        // Cek apakah pengguna memiliki role yang sesuai jika parameter role diberikan
        if ($role && $request->user()->role !== $role) {
            return redirect('/'); // Redirect jika role tidak sesuai
        }

        return $next($request);
    }
}
