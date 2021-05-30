import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { FilterPipe } from "./filter.pipe";
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { EditComponent } from "./edit/edit.component";
import { Routes, RouterModule } from "@angular/router";
import { IndexComponent } from "./index/index.component";
import { InsertComponent } from "./insert/insert.component";
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ShareService} from './share.service';
import { HeaderComponent } from "./header/header.component";
import { NavComponent } from "./nav/nav.component";
import { AuthGuardService } from "./auth-guard.service";
import { CookieService } from 'ngx-cookie-service';

const appRoutes: Routes = [
  { path: "index", component: IndexComponent ,canActivate:[AuthGuardService]},
  { path: "edit", component: EditComponent,canActivate:[AuthGuardService]},
  { path: "insert", component: InsertComponent,canActivate:[AuthGuardService]},
  { path: "", redirectTo: "/index", pathMatch: "full" },
  { path: "**", component: AppComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    FilterPipe,
    EditComponent,
    IndexComponent,
    InsertComponent,
    HeaderComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    HttpClientModule,
    MatSortModule,
    MatTableModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule
  ],
  exports: [
    MatSortModule,
    MatTableModule
  ],
  providers: [ShareService,CookieService],
  bootstrap: [AppComponent,NavComponent,HeaderComponent]
})
export class AppModule {}
