export interface DetailedTask {
  node?: string;
  id?: number;
  type?: string;
  action?: string;
  status?: Status;
  description?: string;
  start_time?: Date;
  start_time_in_millis?: number;
  running_time?: string;
  running_time_in_nanos?: number;
  cancellable?: boolean;
  parent_task_id?: string;
  headers?: Headers;
}

export interface Headers {
  [key: string]: any;
}

export interface Status {
  phase?: string;
}
