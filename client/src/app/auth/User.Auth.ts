import { Injectable } from "@angular/core";
import { UserAuthModel } from "../models/user-auth.model";
import { CookieService } from "ngx-cookie-service";
import { jwtDecode } from "jwt-decode";

@Injectable({
    providedIn: "root"
})
export class UserAuth {
    currentUser: UserAuthModel | null = null;

  constructor(private cookieService: CookieService) { }

  setUser(user: UserAuthModel): void {
    this.currentUser = user;
  }

  authUserFromToken(): void {
    let token = this.getTokenFromCookie();
    if (token) {
      let decodedToken = this.decodeToken(token);
      let user = decodedToken.claims;
      user.infos = decodedToken.claims;
      this.setUser(user);
    }
  }

  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  }

  clearUser(): void {
    this.cookieService.delete('token');
    this.currentUser = null;
  }

  getTokenFromCookie(): string {
    return this.cookieService.get('token');
  }
}