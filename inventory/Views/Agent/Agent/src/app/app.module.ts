import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FilterPipe } from "./filter.pipe";
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { InsertComponent } from './insert/insert.component';
import { EditComponent } from './edit/edit.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from "@angular/common/http";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material";
import { MatNativeDateModule } from "@angular/material";
import {ShareService} from './share.service';
import { NavComponent } from './nav/nav.component';
import { HeaderComponent } from "./header/header.component";
import { AuthGuardService } from './auth-guard.service';

const appRoutes: Routes = [
  { path: "home", component: HomeComponent,canActivate:[AuthGuardService]},
  { path: "edit", component: EditComponent,canActivate:[AuthGuardService]},
  { path: "insert", component: InsertComponent,canActivate:[AuthGuardService]},
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "**", component: AppComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    FilterPipe,
    HomeComponent,
    InsertComponent,
    EditComponent,
    HeaderComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    HttpClientModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    ReactiveFormsModule
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
  bootstrap: [AppComponent,HeaderComponent,NavComponent]

})
export class AppModule { }
