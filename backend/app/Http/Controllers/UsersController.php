<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUsersRequest;
use App\Http\Requests\UpdateUsersRequest;
use App\Services\UserService; // Certifique-se de que o service está corretamente importado
use Exception; // Para capturar exceções gerais
use Illuminate\Database\Eloquent\ModelNotFoundException; // Para capturar 'recurso não encontrado'
use Illuminate\Http\JsonResponse; // Para tipagem de retorno

class UsersController extends Controller
{
    protected $userService;

    // Injeção de dependência do UserService no construtor
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Display a listing of the resource.
     * Lista todos os usuários.
     */
    public function index(): JsonResponse
    {
        try {
            // Chama o service que retorna os dados brutos (coleção de usuários)
            $users = $this->userService->index();
            // O Controller constrói a resposta JSON de sucesso
            return response()->json($users, 200);
        } catch (Exception $e) {
            // O Controller captura a exceção e constrói a resposta JSON de erro
            return response()->json(['error' => 'Ocorreu um erro ao listar os usuários: ' . $e->getMessage()], 400);
        }
    }

    /**
     * Store a newly created resource in storage.
     * Armazena um novo usuário.
     */
    public function store(StoreUsersRequest $request): JsonResponse
    {
        try {
            // Chama o service que cria e retorna o modelo de usuário
            $user = $this->userService->store($request->validated());
            // O Controller constrói a resposta JSON de sucesso (201 Created)
            return response()->json([
                'message' => 'Usuário cadastrado com sucesso!',
                'data' => $user->only(['id', 'name', 'email', 'role']) // Retorna apenas dados seguros do usuário
            ], 201);
        } catch (Exception $e) {
            // O Controller captura a exceção e constrói a resposta JSON de erro
            return response()->json(['error' => 'Ocorreu um erro ao criar o usuário: ' . $e->getMessage()], 400);
        }
    }

    /**
     * Display the specified resource.
     * Exibe um usuário específico.
     */
    public function show($id): JsonResponse
    {
        try {
            // Chama o service que busca o usuário ou lança ModelNotFoundException
            $user = $this->userService->show($id);
            // O Controller constrói a resposta JSON de sucesso
            return response()->json($user, 200);
        } catch (ModelNotFoundException $e) {
            // O Controller captura ModelNotFoundException e retorna 404
            return response()->json(['error' => 'Usuário não encontrado.'], 404);
        } catch (Exception $e) {
            // O Controller captura outras exceções e retorna 400
            return response()->json(['error' => 'Ocorreu um erro ao buscar o usuário: ' . $e->getMessage()], 400);
        }
    }

    /**
     * Update the specified resource in storage.
     * Atualiza um usuário específico.
     */
    public function update(UpdateUsersRequest $request, $id): JsonResponse
    {
        try {
            // Chama o service que atualiza e retorna o modelo de usuário
            $user = $this->userService->update($request->validated(), $id);
            // O Controller constrói a resposta JSON de sucesso
            return response()->json([
                'message' => 'Usuário atualizado com sucesso!',
                'data' => $user->only(['id', 'name', 'email', 'role']) // Retorna apenas dados seguros do usuário
            ], 200);
        } catch (ModelNotFoundException $e) {
            // O Controller captura ModelNotFoundException e retorna 404
            return response()->json(['error' => 'Usuário não encontrado para atualização.'], 404);
        } catch (Exception $e) {
            // O Controller captura outras exceções e retorna 400
            return response()->json(['error' => 'Ocorreu um erro ao atualizar o usuário: ' . $e->getMessage()], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     * Exclui um usuário específico.
     */
    public function destroy($id): JsonResponse
    {
        try {
            // Chama o service que tenta excluir o usuário (retorna true ou lança exceção)
            $this->userService->destroy($id);
            // O Controller constrói a resposta JSON de sucesso
            return response()->json(['message' => 'Usuário excluído com sucesso!'], 200);
        } catch (ModelNotFoundException $e) {
            // O Controller captura ModelNotFoundException e retorna 404
            return response()->json(['error' => 'Usuário não encontrado para exclusão.'], 404);
        } catch (Exception $e) {
            // O Controller captura outras exceções e retorna 400
            return response()->json(['error' => 'Ocorreu um erro ao deletar o usuário: ' . $e->getMessage()], 400);
        }
    }
}
