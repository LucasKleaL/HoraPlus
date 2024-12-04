import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { UserAuth } from 'src/app/auth/User.Auth';
import { Employee } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/services/employees.service';

@Component({
  selector: 'app-index-employees',
  templateUrl: './index-employees.component.html',
  styleUrls: ['./index-employees.component.scss']
})
export class IndexEmployeesComponent extends AppComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() employees: any[] = [];
  @Input() totalEmployees: number = 0;
  @Input() showActions: boolean = false;
  @Input() editEmployeeHandler: ((employee: Employee) => void) = () => {};
  @Input() deleteEmployeeHandler: ((employee: Employee) => void) = () => {};
  currentPage: number = 1;
  pageSize: number = 10;
  cardInfos = [
    { property: 'department', propertyPath: 'title', label: 'Setor', labelPostfix: '' },
    { property: 'role', propertyPath: 'title', label: 'Cargo', labelPostfix: '' },
    { property: 'totalExtraHours', propertyPath: '', label: 'Total Horas Extras', labelPostfix: 'h' },
    { property: 'totalDaysOff', propertyPath: '', label: 'Total Folgas', labelPostfix: 'h' },
    { property: 'remainingExtraHours', propertyPath: '', label: 'Horas Extras Restantes', labelPostfix: 'h' },
    { property: 'extraHoursCount', propertyPath: '', label: 'Quantidade de Horas Extras', labelPostfix: '' },
    { property: 'daysOffCount', propertyPath: '', label: 'Quantidade de Folgas', labelPostfix: '' },
  ]

  constructor(_snackBar: MatSnackBar, router: Router, private employeesService: EmployeeService, private userAuth: UserAuth) {
    super(_snackBar, router);
  }

  ngOnInit(): void {
    this.getEmployees();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getEmployees();
  }

  async getEmployees(): Promise<void> {
    this.isLoading = true;
    try {
      const response = await this.employeesService.getEmployees(this.userAuth.currentUser?.uid || '');
      this.employees = response.body.employees;
      this.totalEmployees = this.employees.length;
      this.isLoading = false;
    } catch (error) {
      console.error(error);
      this.isLoading = false;
      throw error;
    }
  }

}
