export interface AccountDetails {
    stat:    string;
    account: Account;
}

export interface Account {
    email:            string;
    monitor_limit:    number;
    monitor_interval: number;
    up_monitors:      number;
    down_monitors:    number;
    paused_monitors:  number;
}
