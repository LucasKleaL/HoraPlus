import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { UserAuth } from 'src/app/auth/User.Auth';
import { Employee } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/services/employees.service';

@Component({
  selector: 'app-add-employees',
  templateUrl: './add-employees.component.html',
  styleUrls: ['./add-employees.component.css']
})
export class AddEmployeesComponent extends AppComponent implements OnInit {
  isLoading: boolean = false;
  employeeForm!: FormGroup;
  name = new FormControl('', [Validators.required]);
  department = new FormControl({
    uid: new FormControl(''),
    description: new FormControl('', [Validators.required]),
  });
  role = new FormControl({
    uid: new FormControl(''),
    description: new FormControl('', [Validators.required]),
  });

  constructor(
    _snackBar: MatSnackBar,
    router: Router,
    private employeeService: EmployeeService, 
    private userAuth: UserAuth, 
  ) {
    super(_snackBar, router);
  }

  ngOnInit(): void {
    this.employeeForm = new FormGroup({
      name: this.name,
      department: this.department,
      role: this.role,
    });
  }

  async addEmployee() {
    try {
      this.isLoading = true;
      const userUid = this.userAuth.currentUser?.uid ?? '';
      const name = this.employeeForm.get("name")?.value;
      const department = { uid: '', description: this.employeeForm.get("department")?.value};
      const role = { uid: '', description: this.employeeForm.get("role")?.value}
      const employee = new Employee(
        userUid,
        name,
        role,
        department,
      );

      await this.employeeService.addEmployee(employee)
        .then((response) => {
          this.openSnackBar('Funcionário adicionado com sucesso!', 'Ok', 'success-snackbar');
          this.isLoading = false;
          this.changeActiveRoute('/employees');
        }).catch((error) => {
          console.error(error);
          this.isLoading = false;
          this.openSnackBar('Ocorreu um erro ao adicionar o funcionário.', 'Ok', 'error-snackbar');
          throw error;
        });
    } catch (error) {
      console.error(error);
      this.isLoading = false;
      this.openSnackBar('Ocorreu um erro ao adicionar o funcionário.', 'Ok', 'error-snackbar');
      throw error;
    }
  }

}
