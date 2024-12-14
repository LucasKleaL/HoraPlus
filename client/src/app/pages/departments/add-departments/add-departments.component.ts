import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { UserAuth } from 'src/app/auth/User.Auth';
import { Department } from 'src/app/models/department.model';
import { DepartmentService } from 'src/app/services/department.service';

@Component({
  selector: 'app-add-departments',
  templateUrl: './add-departments.component.html',
  styleUrls: ['./add-departments.component.scss']
})
export class AddDepartmentsComponent extends AppComponent implements OnInit {
  departmentForm!: FormGroup;
  title = new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]);
  description = new FormControl('', [Validators.maxLength(50)]);
  color = new FormControl('', [Validators.required]);

  constructor(
    _snackBar: MatSnackBar,
    router: Router,
    private departmentService: DepartmentService,
    private userAuth: UserAuth,
  ) {
    super(_snackBar, router);
  }

  async ngOnInit() {
    const randomColor = this.generateRandomColor();
    this.color.setValue(randomColor);
    this.departmentForm = new FormGroup({
      title: this.title,
      description: this.description,
      color: this.color,
    });
  }

  generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  async addDepartment() {
    try {
      this.isLoading = true;
      const userUid = this.userAuth.currentUser?.uid ?? '';
      const title = this.departmentForm.get("title")?.value;
      const description = this.departmentForm.get("description")?.value;
      const color = this.departmentForm.get("color")?.value;
      const employee = new Department(
        userUid,
        title,
        description,
        color,
      );

      await this.departmentService.addDepartment(employee)
        .then((response) => {
          this.openSnackBar('Setor adicionado com sucesso!', 'Ok', 'success-snackbar');
          this.isLoading = false;
          this.changeActiveRoute('/departments');
        }).catch((error) => {
          console.error(error);
          this.isLoading = false;
          this.openSnackBar('Ocorreu um erro ao adicionar o setor.', 'Ok', 'error-snackbar');
          throw error;
        });
    } catch (error) {
      console.error(error);
      this.isLoading = false;
      this.openSnackBar('Ocorreu um erro ao adicionar o setor.', 'Ok', 'error-snackbar');
      throw error;
    }
  }
}
