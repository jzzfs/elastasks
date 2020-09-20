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
  NzSpinModule,
  NzStatisticModule,
  NzGridModule,
  NzToolTipModule,
  NzSelectModule
} from "ng-zorro-antd";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
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
    NzStatisticModule,
    NzGridModule,
    NzToolTipModule,
    NzSelectModule,
    TasksRoutingModule
  ],
  declarations: [TasksComponent],
  exports: [TasksComponent]
})
export class TasksModule {}
