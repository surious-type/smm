<?php

namespace App\Http\Controllers;

use App\Models\Panel;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class PanelController extends Controller
{
    /**
     * GET /api/panels
     * Список всех панелей.
     */
    public function index()
    {
        return Panel::all();
    }

    /**
     * POST /api/panels
     * Создание новой панели.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'base_url' => ['required', 'url'],
            'api_key' => ['required', 'string'],
            'enabled' => ['required', 'in:true,false'],
        ]);

        $panel = Panel::create($validated);

        return response()->json($panel, Response::HTTP_CREATED);
    }

    /**
     * GET /api/panels/{id}
     * Отображение конкретной панели.
     */
    public function show(string $id)
    {
        $panel = Panel::findOrFail($id);

        return response()->json($panel);
    }

    /**
     * PUT /api/panels/{id}
     * Обновление данных панели.
     */
    public function update(Request $request, string $id)
    {
        $panel = Panel::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'base_url' => ['sometimes', 'url'],
            'api_key' => ['sometimes', 'string'],
            'enabled' => ['sometimes', 'in:true,false'],
        ]);

        $panel->update($validated);

        return response()->json($panel);
    }

    /**
     * DELETE /api/panels/{id}
     * Удаление панели.
     */
    public function destroy(string $id)
    {
        $panel = Panel::findOrFail($id);
        $panel->delete();

        return response()->json($panel, Response::HTTP_NO_CONTENT);
    }
}
