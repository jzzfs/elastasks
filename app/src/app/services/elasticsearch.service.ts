import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

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
    const client_from_storage = window.localStorage.getItem("clientOpts");
    if (client_from_storage) {
      this.client = JSON.parse(client_from_storage);
    }

    this.client$.subscribe((client) => {
      if (!client || !client.host) {
        window.localStorage.removeItem("clientOpts");
      }
    });
  }

  public hostChanged() {
    return this.client$;
  }

  public hasHost() {
    return this.host && this.host.length;
  }

  public flushHost() {
    this.client = null;
    this.client$.next(this.client);
  }

  private get host() {
    if (!this.client || !this.client.host) {
      return undefined;
    }
    return this.client.host.endsWith("/")
      ? this.client.host.slice(0, -1)
      : this.client.host;
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
    if (this.client && this.client.host) {
      this.client$.next(this.client);
      return;
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

    this.client$.next(this.client);
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

        return resolve(response);
      } else {
        return reject(error);
      }
    });
  }

  async fetchTasks(group_by: "nodes" | "parents" | "none" = "none") {
    this.http
      .get(`${this.host}/_tasks?human&detailed&group_by=${group_by}`, {
        headers: this.getCommonHeaders()
      })
      .toPromise();
  }
}
