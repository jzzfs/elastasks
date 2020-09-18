import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import {
  ElasticsearchService,
  IClientSettings
} from "src/app/services/elasticsearch.service";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { merge } from "rxjs";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
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

  // TOdo
  // confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
  //   if (!this.validateForm.controls.apiKey.value) {
  //     return { required: true };
  //   } else if (control.value !== this.validateForm.controls.password.value) {
  //     return { confirm: true, error: true };
  //   }
  //   return {};
  // };

  constructor(
    private fb: FormBuilder,
    private es: ElasticsearchService,
    private router: Router
  ) {}

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
      this.validateForm &&
      this.validateForm.get("apiKey").value &&
      this.validateForm.get("apiKey").value.length
    );
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      host: [null, [Validators.required]],
      username: [null],
      password: [null],
      apiKey: [null]
    });

    if (this.es.hasHost()) {
      this.isLoginModalVisible = false;
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
      } else {
        if (this.validateForm.get("apiKey").disabled) {
          this.validateForm.get("apiKey").enable();
        }
      }
    });

    this.validateForm.get("apiKey").valueChanges.subscribe((_) => {
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
      this.loading = false;
      return false;
    }

    this.es.initClient(this.validateForm.getRawValue() as IClientSettings);

    try {
      const r = (await this.es.ping()) as any;
      if (r && typeof r.tagline === "string") {
        this.router.navigate(["/monitor"]);
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
