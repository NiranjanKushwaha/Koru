import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContainerModalComponent } from './Components/container-modal/container-modal.component';
import { KoruTableComponent } from './Components/koru-table/koru-table.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { SearchDataComponent } from './Components/search-data/search-data.component';
@NgModule({
  declarations: [
    AppComponent,
    ContainerModalComponent,
    KoruTableComponent,
    SearchDataComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
