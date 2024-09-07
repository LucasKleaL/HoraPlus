import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from 'src/app/app.component';
import { UserAuth } from 'src/app/auth/User.Auth';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends AppComponent implements OnInit {
  loginForm!: FormGroup;
  email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  password: FormControl = new FormControl('', [Validators.required]);
  passwordField!: HTMLInputElement;
  showPassword:boolean = false;
  wrongCredentials: boolean = false;
  isLoading: boolean = false;

  constructor(
    _snackBar: MatSnackBar,
    private userService: UserService,
    private userAuth: UserAuth,
    private router: Router,
    private cookieService: CookieService
  ) {
    super(_snackBar);
  }

  ngOnInit(): void {
    this.passwordField = document.querySelector('#inputPassword')!;
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password
    });
  }

  async login(): Promise<void> {
    try {
      this.isLoading = true;
      const encryptedPassword = this.encryptPassword(this.loginForm);
      const email = this.loginForm.get('email')?.value;
      await this.userService.login(email, encryptedPassword)
        .then((response) => {
          const customToken = response.body.customToken;
          if (customToken) { 
            this.cookieService.set('token', customToken, undefined, '/', undefined, true, 'Strict');
            this.router.navigate(['/home']);
            this.wrongCredentials = false;
          } else {
            this.wrongCredentials = true;
          }
        })
        .catch((error) => {
          this.wrongCredentials = true;
          this.userAuth.clearUser();
          this.isLoading = false;
        });
    } catch (error) {
      this.wrongCredentials = true;
      this.userAuth.clearUser();
      this.isLoading = false;
      throw error;
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
    if (this.showPassword) {
      this.passwordField.type = this.showPassword ? 'text' : 'password';
    }
  }
}
