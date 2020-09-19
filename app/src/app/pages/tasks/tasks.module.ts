import { NgModule } from "@angular/core";

import { TasksRoutingModule } from "./tasks-routing.module";

import { TasksComponent } from "./tasks.component";
import {
  NzInputModule,
  NzButtonModule,
  NzCardModule,
  NzModalModule
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
    TasksRoutingModule
  ],
  declarations: [TasksComponent],
  exports: [TasksComponent]
})
export class TasksModule {}
