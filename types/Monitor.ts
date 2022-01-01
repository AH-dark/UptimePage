export interface Monitor {
    stat: string;
    pagination: Pagination;
    monitors: MonitorElement[];
}

export interface MonitorElement {
    id: number;
    friendly_name: string;
    url: string;
    type: number;
    sub_type: string;
    keyword_type: string | null;
    keyword_case_type: string | null;
    keyword_value: string;
    http_username: string;
    http_password: string;
    port: string;
    interval: number;
    status: number;
    create_datetime: number;
    monitor_group?: number;
    is_group_main?: number;
    logs?: Log[];
    all_time_uptime_ratio?: number;
    custom_uptime_ranges?: string;
}

interface Log {
    type: number;
    datetime: number;
    duration: number;
}

interface Pagination {
    offset: number;
    limit: number;
    total: number;
}
