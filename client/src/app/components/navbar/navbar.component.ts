import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { UserAuth } from 'src/app/auth/User.Auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent extends AppComponent implements OnInit {

  constructor(_snackBar: MatSnackBar, public userAuth: UserAuth, router: Router) {
    super(_snackBar, router);
  }

  ngOnInit(): void {
    this.userAuth.authUserFromToken();
    console.log(this.userAuth.currentUser);
  }

  logout(): void {
    this.userAuth.clearUser();
    this.router.navigate(['/login']);
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

}
