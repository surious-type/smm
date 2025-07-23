<?php

namespace App\Services;

use App\Enums\StrategyType;
use App\Models\SimpleStrategy;
use App\Models\SmartStrategy;

class StrategyService
{
    public function create(string $strategy_type, array $data)
    {
        return match ($strategy_type) {
            StrategyType::SIMPLE->value => SimpleStrategy::create($data),
            StrategyType::SMART->value => SmartStrategy::create($data),
        };
    }
}
