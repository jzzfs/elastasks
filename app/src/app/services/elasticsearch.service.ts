import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { group } from "console";

interface IClientSettings {
  host: string;
  auth?: {
    username?: string;
    password?: string;
    apiKey?: string;
  };
}

@Injectable({
  providedIn: "root"
})
export class ElasticsearchService {
  private client: IClientSettings;

  constructor(private http: HttpClient) {}

  private constructBasicAuthHeader() {
    const b64token = btoa(
      `${this.client.auth.username}:${this.client.auth.password}`
    );
    return {
      Authorization: `Basic ${b64token}`
    };
  }

  initClient(opts: IClientSettings) {
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

  async fetchTasks(group_by: "nodes" | "parents" | "none" = "none") {
    const url = this.client.host.endsWith("/")
      ? this.client.host.slice(0, -1)
      : this.client.host;
    this.http
      .get(`${url}/_tasks?human&detailed&group_by=${group_by}`)
      .toPromise();
  }
}
