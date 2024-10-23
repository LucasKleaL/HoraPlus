import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import * as CryptoJS from 'crypto-js';
import { User } from 'src/app/models/user.model';
import { AppComponent } from 'src/app/app.component';
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent extends AppComponent implements OnInit {
  registerForm!: FormGroup;
  nameInvalidLabel:string = 'O nome completo é obrigatório!';
  emailInvalidLabel:string = 'O e-mail é obrigatório!';
  passwordInvalidLabel:string = 'A senha é obrigatória!';
  emailAlreadyExists:boolean = false;
  showConfirmPassword: boolean = false;
  name = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  confirmPassword = new FormControl('', [Validators.required, this.passwordMatchValidator]);
  //role = new FormControl('', [Validators.required]);
  //department = new FormControl('', [Validators.required]);
  isLoading:boolean = false;
  submitted:boolean = false;

  constructor(_snackBar: MatSnackBar, router: Router, private userService: UserService) {
    super(_snackBar, router);
  }

  ngOnInit(): void {
      this.registerForm = new FormGroup({
        name: this.name,
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword,
        //role: this.role,
        //department: this.department,
      });
  }

  async signUp(): Promise<void> {
    console.log('signup');
    try {
      this.isLoading = true;
      const encryptedPassword = this.encryptPassword(this.registerForm);
      const systemRole = 'user';
      const newUser = new User(
        this.registerForm.get('email')?.value,
        encryptedPassword,
        this.registerForm.get('name')?.value,
        systemRole,
        this.registerForm.get('role')?.value,
        this.registerForm.get('department')?.value,
      );
      await this.userService
        .addUser(newUser)
        .then((response) => {
          if (response.body.status === 201) {
            this.router.navigateByUrl('/login');
            this.isLoading = false;
          }
        })
        .catch((error) => {
          if (error.status === 409) {
            this.emailAlreadyExists = true;
            this.emailInvalidLabel = "O e-mail já está em uso.";
          } else {
            this.openSnackBar(
              'Ocorreu um erro no cadastro do usuário.',
              'OK',
              'snackbar-error',
            );
          }
          console.error(error);
          this.isLoading = false;
        });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
    const passwordField = document.querySelector('#password') as HTMLInputElement;
    if (passwordField) {
      passwordField.type = this.showConfirmPassword ? 'text' : 'password';
    }
    const confirmPasswordField = document.querySelector('#confirmPassword') as HTMLInputElement;
    if (confirmPasswordField) {
      confirmPasswordField.type = this.showConfirmPassword ? 'text' : 'password';
    }
  }

  passwordMatchValidator(control: FormControl): { [key: string]: boolean } | null {
    const password = control.root.get('password');
    return password && control.value !== password.value ? { 'passwordMatch': true } : null;
  }

}
