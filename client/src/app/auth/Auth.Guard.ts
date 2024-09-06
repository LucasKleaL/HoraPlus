import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Data, Router, RouterStateSnapshot } from '@angular/router';
import { UserAuth } from './User.Auth';

interface RouteData extends Data 
{
  canActivateLogin?: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  
  constructor(private userAuth: UserAuth, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.userAuth.authUserFromToken();
  
    const routeData = route.data as RouteData;
  
    if (routeData.canActivateLogin && this.userAuth.currentUser) {
      this.router.navigate(['/']);
      return false;
    }
  
    if (!routeData.canActivateLogin && !this.userAuth.currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
  
  canActivateLogin(): boolean {
    this.userAuth.authUserFromToken();
    if (this.userAuth.currentUser) {
      return false;
    } else {
      this.router.navigate(['/jobs']);
      return true;
    }
  }

}
