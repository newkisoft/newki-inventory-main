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
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material";
import { MatNativeDateModule } from "@angular/material";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from "./nav/nav.component";
import { HeaderComponent } from "./header/header.component";
import { ShareService } from "./share.service";
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
  bootstrap: [AppComponent,NavComponent,HeaderComponent]
})
export class AppModule {}
