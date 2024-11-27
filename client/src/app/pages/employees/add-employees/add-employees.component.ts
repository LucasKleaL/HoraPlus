import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { UserAuth } from 'src/app/auth/User.Auth';
import { Department } from 'src/app/models/department.model';
import { Employee } from 'src/app/models/employee.model';
import { Role } from 'src/app/models/role.model';
import { DepartmentService } from 'src/app/services/department.service';
import { EmployeeService } from 'src/app/services/employees.service';
import { RolesService } from 'src/app/services/roles.service';

@Component({
  selector: 'app-add-employees',
  templateUrl: './add-employees.component.html',
  styleUrls: ['./add-employees.component.scss']
})
export class AddEmployeesComponent extends AppComponent implements OnInit {
  employeeForm!: FormGroup;
  name = new FormControl('', [Validators.required]);
  department = new FormControl<string | Department>('', [Validators.required]);
  departments: Department[] = [];
  role = new FormControl<string | Role>('', [Validators.required]);
  roles: Role[] = [];
  
  constructor(
    _snackBar: MatSnackBar,
    router: Router,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private roleService: RolesService,
    private userAuth: UserAuth, 
  ) {
    super(_snackBar, router);
  }

  async ngOnInit() {
    this.employeeForm = new FormGroup({
      name: this.name,
      department: this.department,
      role: this.role,
    });
    await this.getDepartments();
    await this.getRoles();
  }

  async getDepartments(): Promise<void> {
    try {
      this.isLoading = true;
      const response = await this.departmentService.getAllDepartmentsByUser(this.userAuth.currentUser?.uid ?? '');
      this.departments = response.body.departments;
      this.isLoading = false;
    } catch (error) {
      throw error;
    }
  }

  get departmentControl(): FormControl {
    return this.employeeForm.get('department') as FormControl;
  }

  async getRoles(): Promise<void> {
    try {
      this.isLoading = true;
      const response = await this.roleService.getAllRolesByUser(this.userAuth.currentUser?.uid ?? '');
      this.roles = response.body.roles;
      this.isLoading = false;
    } catch (error) {
      throw error;
    }
  }

  get roleControl(): FormControl {
    return this.employeeForm.get('role') as FormControl;
  }

  async addEmployee() {
    try {
      this.isLoading = true;
      const userUid = this.userAuth.currentUser?.uid ?? '';
      const name = this.employeeForm.get("name")?.value;
      const department = this.employeeForm.get("department")?.value;
      const role = this.employeeForm.get("role")?.value;
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
