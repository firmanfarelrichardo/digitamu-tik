<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);
        
        // Exclude CSRF verification for API-like routes from separate frontend
        $middleware->validateCsrfTokens(except: [
            'auth/*',
            'admin/*',
            'janji-temu',
            'peminjaman',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
