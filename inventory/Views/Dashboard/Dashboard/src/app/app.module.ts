import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FilterPipe } from "./filter.pipe";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { Routes, RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material";
import { MatNativeDateModule } from "@angular/material";
import { HashLocationStrategy, LocationStrategy, CommonModule } from '@angular/common';
import { ShareService } from "./share.service";
import { NavComponent } from "./nav/nav.component";
import { HeaderComponent } from "./header/header.component";
import { AuthGuardService } from "./auth-guard.service";
import {DragDropModule} from '@angular/cdk/drag-drop';

const appRoutes: Routes = [
  { path: "home", component: HomeComponent ,canActivate:[AuthGuardService]},
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "**", component: AppComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    FilterPipe,
    HomeComponent,
    NavComponent,
    HeaderComponent

  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    HttpClientModule,
    MatFormFieldModule,
    DragDropModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  exports: [
    MatAutocompleteModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  providers: [ShareService],
  bootstrap: [AppComponent,NavComponent,HeaderComponent]
})
export class AppModule {}
