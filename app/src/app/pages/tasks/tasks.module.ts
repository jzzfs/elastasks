import { NgModule } from "@angular/core";

import { TasksRoutingModule } from "./tasks-routing.module";

import { TasksComponent } from "./tasks.component";
import {
  NzInputModule,
  NzButtonModule,
  NzCardModule,
  NzModalModule,
  NzEmptyModule,
  NzDropDownModule,
  NzDividerModule,
  NzTableModule,
  NzPopconfirmModule,
  NzBadgeModule,
  NzIconModule,
  NzNotificationModule,
  NzSpinModule
} from "ng-zorro-antd";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@NgModule({
  imports: [
    CommonModule,

    NzInputModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzCardModule,
    NzModalModule,
    NzEmptyModule,
    NzDropDownModule,
    NzDividerModule,
    NzBadgeModule,
    NzTableModule,
    NzPopconfirmModule,
    NzIconModule,
    NzNotificationModule,
    NzSpinModule,
    TasksRoutingModule
  ],
  declarations: [TasksComponent],
  exports: [TasksComponent]
})
export class TasksModule {}
