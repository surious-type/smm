import { OrderStatus, PostType, StrategyType, TaskStatus } from '@/enums.ts';

export interface DPanel {
    id:         number
    name:       string
    base_url:   string
    api_key: string
    enabled:    boolean
    created_at: string
    updated_at: string
}

export interface DSimpleStrategy {
    id:          number
    service_id:  number
    quantity:    number
    created_at?: string
    updated_at?: string
}

export interface DSmartStrategy {
    id:                   number
    qty_from:             number
    qty_to:               number
    first_hour_pct:       number
    first_hour_service:   number
    remainder_hours:      number
    remainder_service:    number
    created_at?: string
    updated_at?: string
}

export interface DTask {
    id:            number
    channel_link:  string
    panel_id:      number
    post_type:     PostType
    last_message_id?: number | null
    end_at?:         string | null
    count_post?:     number | null
    status:        TaskStatus
    strategy_id:   number
    strategy_type: StrategyType
    created_at:    string
    updated_at:    string
}

export interface DPost {
    id:            number
    task_id:       number
    message_id:    number
    published_at?: string | null
    total_orders:  number
    done_orders:   number
    failed_orders: number
    created_at:    string
    updated_at:    string
}

export interface DOrder {
    id:           number
    post_id:      number
    service_id:   number
    quantity:     number
    run_at?:      string | null
    external_id?: string | null
    status:       OrderStatus
    created_at:   string
    updated_at:   string
}
