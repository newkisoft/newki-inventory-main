import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HomeComponent } from "./home/home.component";
import { InsertComponent } from "./insert/insert.component";
import { EditComponent } from "./edit/edit.component";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShareService } from "./share.service";
import { NavComponent } from "./nav/nav.component";
import { HeaderComponent } from "./header/header.component";
import { AuthGuardService } from "./auth-guard.service";
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

const appRoutes: Routes = [
  { path: "home", component: HomeComponent,canActivate:[AuthGuardService]},
  { path: "edit", component: EditComponent,canActivate:[AuthGuardService]},
  { path: "insert", component: InsertComponent ,canActivate:[AuthGuardService]},
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "**", component: AppComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    EditComponent,
    HomeComponent,
    InsertComponent,
    NavComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ReactiveFormsModule
  ],
  providers: [ShareService],
  bootstrap: [AppComponent,NavComponent,HeaderComponent]
})
export class AppModule { }
