import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './pages/signup/signup.component';
import { AuthGuard } from './auth/Auth.Guard';

const routes: Routes = [
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [AuthGuard],
    data: { canActivateLogin: true },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
