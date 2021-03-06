import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import {
  ElasticsearchService,
  IClientSettings
} from "src/app/services/elasticsearch.service";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { merge } from "rxjs";
import { NzMessageService } from "ng-zorro-antd";
import { DeviceDetectorService } from "ngx-device-detector";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  isLoginModalVisible = true;
  validateForm!: FormGroup;
  loading = false;
  loginError: any;

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => {});
  }

  constructor(
    private fb: FormBuilder,
    private es: ElasticsearchService,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private device: DeviceDetectorService
  ) {
    if (this.route.snapshot.queryParamMap.get("force")) {
      this.es.flushHost();
      this.isLoginModalVisible = true;
    }

    if (this.route.snapshot.queryParamMap.get("infoMsg")) {
      this.message.warning(
        "Could not establish connection. Please connect to your cluster first.",
        {
          nzDuration: 5e3,
          nzPauseOnHover: true
        }
      );
    }

    if (!this.device.isDesktop()) {
      this.message.info("This application is optimized for desktops.", {
        nzDuration: 8e3,
        nzPauseOnHover: true
      });
    }
  }

  private apiKeyShouldDisable() {
    if (!this.validateForm) {
      return false;
    }

    return (
      (this.validateForm.get("username").value &&
        this.validateForm.get("username").value.length) ||
      (this.validateForm.get("password").value &&
        this.validateForm.get("password").value.length)
    );
  }

  private basicAuthShouldDisable() {
    return (
      (this.validateForm &&
        this.validateForm.get("apiKey").value &&
        this.validateForm.get("apiKey").value.length) ||
      (this.validateForm.get("apiKeyId").value &&
        this.validateForm.get("apiKeyId").value.length)
    );
  }

  async ngOnInit() {
    this.validateForm = this.fb.group({
      host: [null, [Validators.required]],
      username: [null],
      password: [null],
      apiKey: [null],
      apiKeyId: [null],
      useCorsAnywhere: [true]
    });

    if (this.es.hasHost()) {
      this.isLoginModalVisible = false;
      this.es.initClient();

      const r = (await this.es.ping()) as any;
      if (r && typeof r.tagline === "string") {
        this.router.navigate(["/tasks"]);
        return;
      } else {
        this.validateForm.reset();
        this.loading = false;
        this.isLoginModalVisible = true;
        this.loginError = `Could not ping ${this.es.rawHost}. Please retry.`;
      }
    }

    this.validateForm.valueChanges.subscribe((_) => {
      if (this.loginError) {
        this.loginError = undefined;
      }
    });

    merge(
      this.validateForm.get("username").valueChanges,
      this.validateForm.get("password").valueChanges
    ).subscribe((_) => {
      if (this.apiKeyShouldDisable()) {
        if (!this.validateForm.get("apiKey").disabled) {
          this.validateForm.get("apiKey").disable();
        }

        if (!this.validateForm.get("apiKeyId").disabled) {
          this.validateForm.get("apiKeyId").disable();
        }
      } else {
        if (this.validateForm.get("apiKey").disabled) {
          this.validateForm.get("apiKey").enable();
        }

        if (this.validateForm.get("apiKeyId").disabled) {
          this.validateForm.get("apiKeyId").enable();
        }
      }
    });

    merge(
      this.validateForm.get("apiKey").valueChanges,
      this.validateForm.get("apiKeyId").valueChanges
    ).subscribe((_) => {
      if (this.basicAuthShouldDisable()) {
        if (!this.validateForm.get("username").disabled) {
          this.validateForm.get("username").disable();
        }
        if (!this.validateForm.get("password").disabled) {
          this.validateForm.get("password").disable();
        }
      } else {
        if (this.validateForm.get("username").disabled) {
          this.validateForm.get("username").enable();
        }

        if (this.validateForm.get("password").disabled) {
          this.validateForm.get("password").enable();
        }
      }
    });
  }

  async submitForm() {
    this.loginError = undefined;
    this.loading = true;

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (!this.validateForm.valid) {
      console.warn("invalid form", this.validateForm);
      this.loading = false;
      return false;
    }

    const tmp = this.validateForm.getRawValue();
    const host = tmp.host;
    delete tmp.host;

    const raw_form_value = {
      host,
      auth: {
        ...tmp
      },
      useCorsAnywhere: tmp.useCorsAnywhere
    } as IClientSettings;

    Object.entries(this.validateForm.controls).map(([name, control]) => {
      if (control.disabled) {
        delete raw_form_value.auth[name];
      }
    });

    this.es.initClient(raw_form_value);

    try {
      const r = (await this.es.ping()) as any;
      if (r && typeof r.tagline === "string") {
        this.validateForm.reset();
        this.loading = false;
        this.isLoginModalVisible = false;
        this.router.navigate(["/tasks"]);
      } else {
        this.loading = false;
        this.loginError = r;
      }
    } catch (err) {
      this.loading = false;
      switch (true) {
        case err instanceof HttpErrorResponse:
          this.loginError = err.message;
          break;
        default:
          this.loginError = err;
      }
    }
  }
}
