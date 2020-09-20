import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ElasticsearchService } from "src/app/services/elasticsearch.service";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { Task } from "src/app/interfaces/tasks";
import { NzNotificationService, NzButtonComponent } from "ng-zorro-antd";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";

type TtaskTree = { [key: string]: Task[] };
@Component({
  selector: "app-tasks",
  templateUrl: "./tasks.component.html",
  styleUrls: ["./tasks.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class TasksComponent implements OnInit {
  constructor(
    private es: ElasticsearchService,
    private router: Router,
    private notification: NzNotificationService
  ) {
    this.tasksList$.subscribe((_) => {
      this.lastRefreshedAt = new Date();
    });
  }

  loading = false;

  private tasksList$: BehaviorSubject<Task[]> = new BehaviorSubject([]);
  public taskTree: TtaskTree = {};

  lastRefreshedAt: Date;

  public get tasksList() {
    return this.tasksList$.value;
  }

  collapse(array: Task[], data: Task, $event: boolean): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach((d) => {
          const target = array.find((a) => a.id === d.id)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: Task): Task[] {
    const stack: Task[] = [];
    const array: Task[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({
            ...node.children[i],
            level: node.level! + 1,
            expand: false,
            parent: node
          });
        }
      }
    }

    return array;
  }

  visitNode(
    node: Task,
    hashMap: { [key: string]: boolean },
    array: Task[]
  ): void {
    if (!hashMap[node.id]) {
      hashMap[node.id] = true;
      array.push(node);
    }
  }

  async doFetch() {
    this.loading = true;

    const r = await this.es.fetchTasks();
    if (r && !(r instanceof Error)) {
      const tree: TtaskTree = {};

      this.tasksList$.next(r);

      r.forEach((item) => {
        tree[item.id] = this.convertTreeToList(item);
      });

      this.taskTree = tree;
      this.loading = false;
    }
  }

  async ngOnInit() {
    if (this.es.hasHost()) {
      this.es.initClient();
      const r = (await this.es.ping()) as any;
      if (!r || (r && typeof r.tagline !== "string")) {
        this.router.navigate(["/login"]);
        return;
      }
    } else {
      this.router.navigate(["/login"], { queryParams: { force: true } });
      return;
    }

    this.doFetch();
  }

  async doCancelTask(
    button_ref: NzButtonComponent,
    node_id: string,
    task_id: string
  ) {
    button_ref.disabled = true;

    try {
      const r = (await this.es.cancelTask(`${node_id}:${task_id}`)) as any;
      if (
        !r.node_failures ||
        (r.node_failures && Object.keys(r.node_failures).length === 0)
      ) {
        this.notification.success(
          "Task Cancellation success",
          JSON.stringify(r)
        );
        setTimeout(async () => {
          await this.doFetch();
        }, 1e3);
      } else {
        throw new Object({
          status: 500,
          message: JSON.stringify(r)
        });
      }
    } catch (err) {
      const error = <HttpErrorResponse>err;

      console.warn({ err });

      const text =
        error.error && error.error.error && error.error.error.reason
          ? error.error.error.reason
          : error.message;

      this.notification.error(
        `Task Cancellation failure: ${error.status}`,
        text,
        {
          nzDuration: 20e3
        }
      );

      button_ref.disabled = false;
    }
  }
}
