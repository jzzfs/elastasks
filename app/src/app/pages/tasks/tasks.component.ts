import { Component, OnInit } from "@angular/core";
import { ElasticsearchService } from "src/app/services/elasticsearch.service";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { Task } from "src/app/interfaces/tasks";

@Component({
  selector: "app-tasks",
  templateUrl: "./tasks.component.html",
  styleUrls: ["./tasks.component.scss"]
})
export class TasksComponent implements OnInit {
  constructor(private es: ElasticsearchService, private router: Router) {}

  tasksList$: BehaviorSubject<Task[]> = new BehaviorSubject([]);

  async ngOnInit() {
    if (this.es.hasHost()) {
      this.es.initClient();
    } else {
      this.router.navigate(["/login"], { queryParams: { force: true } });
      return;
    }

    const r = await this.es.fetchTasks();
    if (r && r.tasks) {
      this.tasksList$.next(
        Object.entries(r.tasks).map(([id, parent_task], index) => {
          return {
            ...parent_task,
            expand: index === 0
          };
        })
      );
    }
  }
}
