import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { UserAuth } from 'src/app/auth/User.Auth';
import { Department } from 'src/app/models/department.model';
import { DepartmentService } from 'src/app/services/department.service';

@Component({
  selector: 'app-index-departments',
  templateUrl: './index-departments.component.html',
  styleUrls: ['./index-departments.component.scss']
})
export class IndexDepartmentsComponent extends AppComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() departments: any[] = [];
  @Input() totalDepartments: number = 0;
  @Input() showActions: boolean = false;
  @Input() editDepartmentHandler: ((department: Department) => void) = () => {};
  @Input() deleteDepartmentHandler: ((department: Department) => void) = () => {};
  currentPage: number = 1;
  pageSize: number = 10;
  cardInfos = [
    { property: 'created', propertyPath: '', label: 'Data de Criação', labelPostfix: '', color: false, colorTag: false },
    { property: 'color', propertyPath: '', label: 'Cor', labelPostfix: '', color: true, colorTag: false },
  ];

  constructor(_snackBar: MatSnackBar, router: Router, private departmentService: DepartmentService, private userAuth: UserAuth) {
    super(_snackBar, router);
  }

  ngOnInit(): void {
    this.getDepartments();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getDepartments();
  }

  async getDepartments(): Promise<void> {
    this.isLoading = true;
    try {
      const response = await this.departmentService.getDepartmentsPaginated(this.userAuth.currentUser?.uid || '');
      this.departments = response.body.departments;
      this.totalDepartments = this.departments.length;
      this.isLoading = false;
    } catch (error) {
      console.error(error);
      this.isLoading = false;
      throw error;
    }
  }
}
