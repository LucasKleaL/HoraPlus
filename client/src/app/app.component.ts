import { Component } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormGroup } from '@angular/forms';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  //title = 'HoraPlus';
  activeRoute: string = '';

  constructor(public _snackBar: MatSnackBar) {}

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
  }
}
