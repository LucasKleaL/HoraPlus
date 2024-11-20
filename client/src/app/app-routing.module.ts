import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './pages/signup/signup.component';
import { AuthGuard } from './auth/Auth.Guard';
import { LoginComponent } from './pages/login/login.component';
import { IndexExtraHoursComponent } from './pages/extra-hours/index-extra-hours/index-extra-hours.component';
import { AddExtraHoursComponent } from './pages/extra-hours/add-extra-hours/add-extra-hours.component';
import { IndexEmployeesComponent } from './pages/employees/index-employees/index-employees.component';
import { AddEmployeesComponent } from './pages/employees/add-employees/add-employees.component';

const routes: Routes = [
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [AuthGuard],
    data: { canActivateLogin: true },
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
    data: { canActivateLogin: true },
  },
  { path: 'extrahours', component: IndexExtraHoursComponent, canActivate: [AuthGuard] },
  { path: 'extrahours/add', component: AddExtraHoursComponent, canActivate: [AuthGuard] },
  { path: 'employees', component: IndexEmployeesComponent, canActivate: [AuthGuard] },
  { path: 'employees/add', component: AddEmployeesComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
