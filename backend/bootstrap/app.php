<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\HandleCors; // <-- Adicione esta linha AQUI para importar o middleware

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            // Adicione seu middleware CORS aqui para o grupo 'api'
            HandleCors::class, // <-- Adicione esta linha AQUI para registrar
        ]);

        // Se você tiver outros middlewares globais ou para outros grupos, eles podem vir aqui.
        // Por exemplo:
        // $middleware->web(append: [
        //     \App\Http\Middleware\TrustProxies::class,
        // ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
