import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { UserAuth } from 'src/app/auth/User.Auth';
import { DayOff } from 'src/app/models/day-off.model';
import { DayOffService } from 'src/app/services/day-off.service';

@Component({
  selector: 'app-index-days-off',
  templateUrl: './index-days-off.component.html',
  styleUrls: ['./index-days-off.component.css']
})
export class IndexDaysOffComponent extends AppComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() daysOff: any[] = [];
  @Input() totalDaysOff: number = 0;
  @Input() showActions: boolean = false;
  @Input() editDayOffHandler: ((extraHour: DayOff) => void) = () => {};
  @Input() deleteDayOffHandler: ((extraHour: DayOff) => void) = () => {};
  currentPage: number = 1;
  pageSize: number = 10;
  
  constructor(_snackBar: MatSnackBar, router: Router, private dayOffService: DayOffService, private userAuth: UserAuth) {
    super(_snackBar, router);
  }

  ngOnInit(): void {
    this.getDaysOffPaginated();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getDaysOffPaginated();
  }

  async getDaysOffPaginated(): Promise<void> {
    this.isLoading = true;
    try {
      const response = await this.dayOffService.getDaysOffPaginated(this.userAuth.currentUser?.uid || '');
      this.daysOff = response.body.daysOff;
      this.totalDaysOff = this.daysOff.length;
      this.isLoading = false;
    } catch (error) {
      console.error(error);
      this.isLoading = false;
      throw error;
    }
  }
}
