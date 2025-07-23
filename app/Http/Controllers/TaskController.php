<?php

namespace App\Http\Controllers;

use App\Enums\StrategyType;
use App\Http\Resources\TaskResource;
use App\Models\SimpleStrategy;
use App\Models\SmartStrategy;
use App\Models\Task;
use Illuminate\Http\Request;
use App\Enums\TaskStatus;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return TaskResource::collection(Task::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $strategy_type = $request->get('strategy_type');
        $strategy = $request->get('strategy');
        $strategy = match ($strategy_type) {
            StrategyType::SIMPLE->value => SimpleStrategy::create($strategy),
            StrategyType::SMART->value => SmartStrategy::create($strategy),
        };
        $task = Task::create([
            ...$request->all(),
            'strategy_id' => $strategy->id,
            'status' => TaskStatus::CREATED->value,
        ]);

        return new TaskResource($task);
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        //
    }
}
