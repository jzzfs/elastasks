import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "/tasks" },
  {
    path: "login",
    loadChildren: () =>
      import("./pages/login/login.module").then((m) => m.LoginModule)
  },
  {
    path: "tasks",
    loadChildren: () =>
      import("./pages/tasks/tasks.module").then((m) => m.TasksModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
