<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUsersRequest;
use App\Http\Requests\UpdateUsersRequest;
use App\Services\UserService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;

class UsersController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index(): JsonResponse
    {
        try {
            $users = $this->userService->index();
            return response()->json($users, 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Ocorreu um erro ao listar os usuários: ' . $e->getMessage()], 400);
        }
    }

    public function store(StoreUsersRequest $request): JsonResponse
    {
        try {
            $user = $this->userService->store($request->validated());
            return response()->json([
                'message' => 'Usuário cadastrado com sucesso!',
                'data' => $user->only(['id', 'name', 'email', 'role'])
            ], 201);
        } catch (Exception $e) {
            return response()->json(['error' => 'Ocorreu um erro ao criar o usuário: ' . $e->getMessage()], 400);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $user = $this->userService->show($id);
            return response()->json($user, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Usuário não encontrado.'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Ocorreu um erro ao buscar o usuário: ' . $e->getMessage()], 400);
        }
    }

    public function update(UpdateUsersRequest $request, $id): JsonResponse
    {
        try {
            $user = $this->userService->update($request->validated(), $id);
            return response()->json([
                'message' => 'Usuário atualizado com sucesso!',
                'data' => $user->only(['id', 'name', 'email', 'role'])
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Usuário não encontrado para atualização.'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Ocorreu um erro ao atualizar o usuário: ' . $e->getMessage()], 400);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $this->userService->destroy($id);
            return response()->json(['message' => 'Usuário excluído com sucesso!'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Usuário não encontrado para exclusão.'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Ocorreu um erro ao deletar o usuário: ' . $e->getMessage()], 400);
        }
    }
}
