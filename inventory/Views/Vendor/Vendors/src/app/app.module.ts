import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { InsertComponent } from './insert/insert.component';
import { EditComponent } from './edit/edit.component';
import { HttpClientModule } from "@angular/common/http";
import { FilterPipe } from "./filter.pipe";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { NavComponent } from './nav/nav.component';
import { HeaderComponent } from './header/header.component';
import { ShareService } from './share.service';
import { AuthGuardService } from './auth-guard.service';

const appRoutes: Routes = [
  { path: "home", component: HomeComponent ,canActivate:[AuthGuardService]},
  { path: "edit", component: EditComponent,canActivate:[AuthGuardService]},
  { path: "insert", component: InsertComponent ,canActivate:[AuthGuardService]},
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "**", component: AppComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FilterPipe,
    InsertComponent,
    EditComponent,
    NavComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    HttpClientModule,
    FormsModule
  ],
  providers: [ShareService],
  bootstrap: [AppComponent,HeaderComponent,NavComponent]
})
export class AppModule { }
