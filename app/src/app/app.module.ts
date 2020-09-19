import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { IconsProviderModule } from "./providers/icons-provider.module";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzMenuModule } from "ng-zorro-antd/menu";

import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NZ_I18N } from "ng-zorro-antd/i18n";
import { en_US } from "ng-zorro-antd/i18n";
import { registerLocaleData, CommonModule } from "@angular/common";
import en from "@angular/common/locales/en";
import { ElasticsearchService } from "./services/elasticsearch.service";
import { NzAlertModule } from "ng-zorro-antd";

registerLocaleData(en);

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzAlertModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }, ElasticsearchService],
  bootstrap: [AppComponent]
})
export class AppModule {}
