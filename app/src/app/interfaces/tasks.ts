export interface ITasksGroupedByParentsResponse {
  tasks?: { [key: string]: Task };
}

export interface Task {
  node?: Node;
  id?: number;
  type?: Type;
  action?: string;
  status?: SliceClass;
  description?: string;
  start_time?: Date;
  start_time_in_millis?: number;
  running_time?: string;
  running_time_in_nanos?: number;
  cancellable?: boolean;
  headers?: TaskHeaders;
  children?: TaskChild[];
  parent_task_id?: string;
}

export interface TaskChild {
  node?: Node;
  id?: number;
  type?: Type;
  action?: string;
  status?: SliceClass;
  description?: string;
  start_time?: Date;
  start_time_in_millis?: number;
  running_time?: string;
  running_time_in_nanos?: number;
  cancellable?: boolean;
  parent_task_id?: string;
  headers?: TaskHeaders;
  children?: TaskChild2n[];
}

export interface TaskChild2n {
  node?: Node;
  id?: number;
  type?: Type;
  action?: string;
  description?: string;
  start_time?: Date;
  start_time_in_millis?: number;
  running_time?: string;
  running_time_in_nanos?: number;
  cancellable?: boolean;
  parent_task_id?: string;
  headers?: TaskHeaders;
  children?: TaskChild3n[];
}

export interface TaskChild3n {
  node?: Node;
  id?: number;
  type?: Type;
  action?: string;
  status?: { [key: string]: any & { [phase: string]: string } };
  description?: string;
  start_time?: Date;
  start_time_in_millis?: number;
  running_time?: string;
  running_time_in_nanos?: number;
  cancellable?: boolean;
  parent_task_id?: string;
  headers?: TaskHeaders;
  children?: TaskChild3n[];
}

export interface TaskHeaders {
  [key: string]: any;
}

export enum Node {
  HBqHzcT4Q7GcQnOXbxzWw = "HBqHzcT4Q7GcQn-OXbxzWw"
}

export enum Type {
  Direct = "direct",
  Transport = "transport"
}

export interface SliceClass {
  slice_id?: number;
  total?: number;
  updated?: number;
  created?: number;
  deleted?: number;
  batches?: number;
  version_conflicts?: number;
  noops?: number;
  retries?: { [key: string]: any };
  throttled?: string;
  throttled_millis?: number;
  requests_per_second?: number;
  throttled_until?: string;
  throttled_until_millis?: number;
  slices?: Array<SliceClass | null>;
}
