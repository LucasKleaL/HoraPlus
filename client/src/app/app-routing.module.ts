import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './pages/signup/signup.component';
import { AuthGuard } from './auth/Auth.Guard';
import { LoginComponent } from './pages/login/login.component';
import { IndexExtraHoursComponent } from './pages/extra-hours/index-extra-hours/index-extra-hours.component';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
