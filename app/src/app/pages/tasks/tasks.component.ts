import { Component, OnInit } from "@angular/core";
import { ElasticsearchService } from "src/app/services/elasticsearch.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-tasks",
  templateUrl: "./tasks.component.html",
  styleUrls: ["./tasks.component.scss"]
})
export class TasksComponent implements OnInit {
  constructor(private es: ElasticsearchService, private router: Router) {}

  ngOnInit(): void {
    if (!this.es.hasHost()) {
      this.router.navigate(["/login"], { queryParams: { force: true } });
      return;
    }
  }
}
