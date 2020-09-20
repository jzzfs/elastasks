import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import {
  ITasksGroupedByParentsResponse,
  ITasksResponseType,
  Task
} from "../interfaces/tasks";
import { transformTasksResponse } from "../pages/tasks/helpers";
import { isLocalNetwork } from "./helpers";

export interface IClientSettings {
  host: string;
  auth?: {
    username?: string;
    password?: string;
    apiKey?: string;
    apiKeyId?: string;
  };
}

@Injectable({
  providedIn: "root"
})
export class ElasticsearchService {
  private client: IClientSettings;
  private client$: BehaviorSubject<IClientSettings> = new BehaviorSubject(null);

  constructor(private http: HttpClient) {
    const client_from_storage = this.clientFromStorage();
    if (client_from_storage) {
      this.client = client_from_storage;
    }
  }

  private clientFromStorage() {
    const client_from_storage = window.localStorage.getItem("clientOpts");
    if (client_from_storage) {
      return JSON.parse(client_from_storage);
    }

    return undefined;
  }

  public hostChanged() {
    return this.client$;
  }

  public hasHost() {
    return this.host && this.host.length;
  }

  public flushHost() {
    window.localStorage.removeItem("clientOpts");
    this.client = null;
    this.client$.next(this.client);
  }

  public get rawHost() {
    if (!this.client || !this.client.host) {
      return undefined;
    }

    return this.client.host;
  }

  private get host() {
    if (!this.client || !this.client.host) {
      return undefined;
    }
    const actual_host = this.client.host.endsWith("/")
      ? this.client.host.slice(0, -1)
      : this.client.host;

    if (isLocalNetwork(actual_host)) {
      return actual_host;
    }

    // wrap due to Allow-Acces-Origin reasons
    return `https://cors-anywhere.herokuapp.com/${actual_host}`;
  }

  private constructBasicAuthHeader() {
    if (!this.client.auth.username || !this.client.auth.password) {
      return {};
    }

    const b64token = btoa(
      `${this.client.auth.username}:${this.client.auth.password}`
    );
    return {
      Authorization: `Basic ${b64token}`
    };
  }

  private constructApiKeyHeader() {
    if (!this.client.auth.apiKey || !this.client.auth.apiKeyId) {
      return {};
    }

    const b64token = btoa(
      `${this.client.auth.apiKeyId}:${this.client.auth.apiKey}`
    );
    return {
      Authorization: `ApiKey ${b64token}`
    };
  }

  private getCommonHeaders() {
    return new HttpHeaders({
      ...this.constructBasicAuthHeader(),
      ...this.constructApiKeyHeader()
    });
  }

  initClient(opts?: IClientSettings) {
    if (!opts && this.clientFromStorage()) {
      opts = this.clientFromStorage();
    }

    this.client = {
      host: opts.host,
      ...(!opts.auth
        ? {}
        : {
            auth: opts.auth.apiKey
              ? { apiKey: opts.auth.apiKey }
              : { username: opts.auth.username, password: opts.auth.password }
          })
    };
  }

  async ping() {
    return new Promise(async (resolve, reject) => {
      let response, error;

      try {
        response = await this.http
          .get(`${this.host}`, { headers: this.getCommonHeaders() })
          .toPromise();
      } catch (err) {
        error = err;
      }

      if (response && typeof response.tagline === "string") {
        window.localStorage.setItem("clientOpts", JSON.stringify(this.client));
        this.client$.next(this.client);
        return resolve(response);
      } else {
        return resolve(error);
      }
    });
  }

  async fetchTasks(
    group_by: ITasksResponseType = "parents"
  ): Promise<Task[] | Error> {
    let resp_promise: Promise<ITasksGroupedByParentsResponse | any>;

    resp_promise = this.http
      .get(`${this.host}/_tasks?human&detailed&group_by=${group_by}`, {
        headers: this.getCommonHeaders()
      })
      .toPromise();

    return new Promise(async (resolve, reject) => {
      try {
        const es_response = await resp_promise;
        if (es_response) {
          return resolve(transformTasksResponse(es_response, group_by));
        } else {
          return reject(new Error("whoops"));
        }
      } catch (err) {
        return reject(err);
      }
    });
  }

  async cancelTask(task_path: string) {
    return this.http
      .post(`${this.host}/_tasks/${task_path}/_cancel`, null, {
        params: {
          // wait_for_completion: "true"
        },
        headers: this.getCommonHeaders()
      })
      .toPromise();
  }
}
