<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\MenusController;
use App\Http\Controllers\MenuItemsController;
use App\Http\Controllers\VisualizationPreferencesController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/users', [UsersController::class, 'index']);
    Route::post('/users', [UsersController::class, 'store']);
    Route::get('/users/{user}', [UsersController::class, 'show']);
    Route::put('/users/{user}', [UsersController::class, 'update']);
    Route::delete('/users/{user}', [UsersController::class, 'destroy']);


    Route::get('/menus', [MenusController::class, 'index']);
    Route::post('/menus', [MenusController::class, 'store']);
    Route::get('/menus/{menu}', [MenusController::class, 'show']);
    Route::put('/menus/{menu}', [MenusController::class, 'update']);
    Route::delete('/menus/{menu}', [MenusController::class, 'destroy']);


    Route::get('/menu-items', [MenuItemsController::class, 'index']);
    Route::post('/menu-items', [MenuItemsController::class, 'store']);
    Route::get('/menu-items/{menuItem}', [MenuItemsController::class, 'show']);
    Route::put('/menu-items/{menuItem}', [MenuItemsController::class, 'update']);
    Route::delete('/menu-items/{menuItem}', [MenuItemsController::class, 'destroy']);

    Route::get('/visualization-preferences', [VisualizationPreferencesController::class, 'index']);
    Route::post('/visualization-preferences', [VisualizationPreferencesController::class, 'store']);
    Route::get('/visualization-preferences/{visualization_preference}', [VisualizationPreferencesController::class, 'show']);
    Route::put('/visualization-preferences/{visualization_preference}', [VisualizationPreferencesController::class, 'update']);
    Route::delete('/visualization-preferences/{visualization_preference}', [VisualizationPreferencesController::class, 'destroy']);
    Route::get('/menus/day/{userId}/{date?}', [VisualizationPreferencesController::class, 'menuByDay']);
    Route::get('/menus/week/{userId}/{startDate?}', [VisualizationPreferencesController::class, 'menuByWeek']);
});
