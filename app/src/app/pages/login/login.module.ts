import { NgModule } from "@angular/core";

import { LoginRoutingModule } from "./login-routing.module";

import { LoginComponent } from "./login.component";
import {
  NzFormModule,
  NzSelectModule,
  NzInputModule,
  NzButtonModule,
  NzCardModule,
  NzDividerModule,
  NzAlertModule,
  NzModalModule,
  NzCheckboxModule,
  NzTagModule,
  NzMessageModule
} from "ng-zorro-antd";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@NgModule({
  imports: [
    CommonModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzCardModule,
    NzDividerModule,
    NzAlertModule,
    NzModalModule,
    NzCheckboxModule,
    NzTagModule,
    NzMessageModule,
    LoginRoutingModule
  ],
  declarations: [LoginComponent],
  exports: [LoginComponent]
})
export class LoginModule {}
