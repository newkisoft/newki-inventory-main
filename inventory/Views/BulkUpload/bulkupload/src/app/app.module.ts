import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { FilterPipe } from "./filter.pipe";
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { IndexComponent } from "./index/index.component";
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from "./nav/nav.component";
import { HeaderComponent } from "./header/header.component";
import { ShareService } from "./share.service";
import { AuthGuardService } from "./auth-guard.service";

const appRoutes: Routes = [
  { path: "index", component: IndexComponent ,canActivate:[AuthGuardService]},
  { path: "", redirectTo: "/index", pathMatch: "full" },
  { path: "**", component: AppComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    FilterPipe,
    IndexComponent,
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
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  exports: [
    MatSortModule,
    MatTableModule
  ],
  providers: [ShareService],
  bootstrap: [AppComponent,NavComponent,HeaderComponent],
})
export class AppModule {}
