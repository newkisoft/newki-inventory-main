import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { FilterPipe } from "./filter.pipe";
import { FormsModule } from "@angular/forms";
import { EditComponent } from "./edit/edit.component";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { InsertComponent } from "./insert/insert.component";
import { HeaderComponent } from "./header/header.component";
import { NavComponent } from "./nav/nav.component";
import { ShareService } from "./share.service";
import { AuthGuardService } from "./auth-guard.service";


const appRoutes: Routes = [
  { path: "index", component: HomeComponent ,canActivate:[AuthGuardService]},
  { path: "edit", component: EditComponent,canActivate:[AuthGuardService]},
  { path: "insert", component: InsertComponent ,canActivate:[AuthGuardService]},
  { path: "", redirectTo: "/index", pathMatch: "full" },
  { path: "**", component: AppComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    FilterPipe,
    EditComponent,
    HomeComponent,
    InsertComponent,
    HeaderComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    HttpClientModule,
    FormsModule
  ],
  providers: [ShareService],
  bootstrap: [AppComponent,NavComponent,HeaderComponent]
})
export class AppModule {}
