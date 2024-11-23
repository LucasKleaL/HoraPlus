import { Component } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormGroup } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  //title = 'HoraPlus';
  activeRoute: string = 'extrahours';
  isNavbarCollapsed: boolean = true;
  
  constructor(public _snackBar: MatSnackBar, public router: Router) {}

  openSnackBar(message: string, action: string, className: string) {
    this._snackBar.open(message, action, {
      duration: 20000,
      panelClass: [className],
    });
  }

  encryptPassword(form: FormGroup): string {
    const password = form.get('password')?.value;
    return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
  }

  changeActiveRoute(routeName: string): void {
    this.activeRoute = routeName;
    this.router.navigate([routeName]);
  }
}
