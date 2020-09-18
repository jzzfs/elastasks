import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import {
  ElasticsearchService,
  IClientSettings
} from "src/app/services/elasticsearch.service";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
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

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      host: [null, [Validators.required]],
      username: [null],
      password: [null],
      apiKey: [null]
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
