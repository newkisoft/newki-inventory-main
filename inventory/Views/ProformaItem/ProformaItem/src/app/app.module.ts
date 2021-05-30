import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { FilterPipe } from "./filter.pipe";
import { FormsModule } from "@angular/forms";
import { EditComponent } from "./edit/edit.component";
import { Routes, RouterModule } from "@angular/router";
import { IndexComponent } from "./index/index.component";
import { InsertComponent } from "./insert/insert.component";
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShareService } from "./share.service";
import { NavComponent } from "./nav/nav.component";
import { HeaderComponent } from "./header/header.component";
import { AuthGuardService } from "./auth-guard.service";

const appRoutes: Routes = [
  { path: "index", component: IndexComponent,canActivate:[AuthGuardService]},
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
    NavComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    HttpClientModule,
    MatSortModule,
    MatTableModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  exports: [
    MatSortModule,
    MatTableModule
  ],
  providers: [ShareService],
  bootstrap: [AppComponent,NavComponent,HeaderComponent]
})
export class AppModule {}
