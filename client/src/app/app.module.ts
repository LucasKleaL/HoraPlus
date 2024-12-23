import { AppComponent } from './app.component';
import { SignupComponent } from './pages/signup/signup.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MatMenuModule } from '@angular/material/menu';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { LoginComponent } from './pages/login/login.component';
import { IndexExtraHoursComponent } from './pages/extra-hours/index-extra-hours/index-extra-hours.component';
import { UserService } from './services/user.service';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { CardInfoDateComponent } from './components/card-info-date/card-info-date.component';
import { CommonModule, DatePipe } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { ExtraHourService } from './services/extra-hour.service';
import { AddExtraHoursComponent } from './pages/extra-hours/add-extra-hours/add-extra-hours.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { IndexEmployeesComponent } from './pages/employees/index-employees/index-employees.component';
import { CardComponent } from './components/card/card.component';
import { AddEmployeesComponent } from './pages/employees/add-employees/add-employees.component';
import { InputAutocompleteComponent } from './components/input-autocomplete/input-autocomplete.component';
import { IndexDaysOffComponent } from './pages/days-off/index-days-off/index-days-off.component';
import { AddDaysOffComponent } from './pages/days-off/add-days-off/add-days-off.component';
import { IndexDepartmentsComponent } from './pages/departments/index-departments/index-departments.component';
import { AddDepartmentsComponent } from './pages/departments/add-departments/add-departments.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    IndexExtraHoursComponent,
    CardInfoDateComponent,
    AddExtraHoursComponent,
    NavbarComponent,
    BreadcrumbComponent,
    IndexEmployeesComponent,
    CardComponent,
    AddEmployeesComponent,
    InputAutocompleteComponent,
    IndexDaysOffComponent,
    AddDaysOffComponent,
    IndexDepartmentsComponent,
    AddDepartmentsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    FormsModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatInputModule,
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatPaginatorModule,
    BsDropdownModule,
    MatMenuModule,
    CommonModule,
    CollapseModule.forRoot(),
    NgxMaskDirective,
    NgxMaskPipe,
    NgbModule
  ],
  providers: [
    DatePipe,
    provideNgxMask(),
    UserService,
    ExtraHourService,
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntl },
    NgbModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
