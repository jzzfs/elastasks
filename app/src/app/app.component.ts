import { Component, ChangeDetectionStrategy } from "@angular/core";
import { ElasticsearchService } from "./services/elasticsearch.service";

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  isCollapsed = false;
  currentHostName: string;

  constructor(private es: ElasticsearchService) {
    this.es.hostChanged().subscribe((client) => {
      this.currentHostName = !client || !client.host ? undefined : client.host;
    });
  }
}
