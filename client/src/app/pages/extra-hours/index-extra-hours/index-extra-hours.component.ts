import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { UserAuth } from 'src/app/auth/User.Auth';
import { ExtraHour } from 'src/app/models/extra-hour.model';
import { ExtraHourService } from 'src/app/services/extra-hour.service';

@Component({
  selector: 'app-index-extra-hours',
  templateUrl: './index-extra-hours.component.html',
  styleUrls: ['./index-extra-hours.component.scss']
})
export class IndexExtraHoursComponent extends AppComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() extraHours: any[] = [];
  @Input() totalExtraHours: number = 0;
  @Input() showActions: boolean = false;
  @Input() editExtraHourHandler: ((extraHour: ExtraHour) => void) = () => {};
  @Input() deleteExtraHourHandler: ((extraHour: ExtraHour) => void) = () => {};
  currentPage: number = 1;
  pageSize: number = 10;
  
  constructor(_snackBar: MatSnackBar, router: Router, private extraHoursService: ExtraHourService, private userAuth: UserAuth) {
    super(_snackBar, router);
  }

  ngOnInit(): void {
    this.getExtraHoursPaginated();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getExtraHoursPaginated();
  }

  async getExtraHoursPaginated(): Promise<void> {
    this.isLoading = true;
    try {
      const response = await this.extraHoursService.getExtraHoursPaginated(this.userAuth.currentUser?.uid || '');
      this.extraHours = response.body.extraHours;
      this.totalExtraHours = this.extraHours.length;
      this.isLoading = false;
    } catch (error) {
      console.error(error);
      this.isLoading = false;
      throw error;
    }
  }
}
