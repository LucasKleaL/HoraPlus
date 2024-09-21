import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuth } from 'src/app/auth/User.Auth';
import { ExtraHour } from 'src/app/models/extra-hour.model';
import { ExtraHourService } from 'src/app/services/extra-hour.service';

@Component({
  selector: 'app-card-extra-hour',
  templateUrl: './card-extra-hour.component.html',
  styleUrls: ['./card-extra-hour.component.css']
})
export class CardExtraHourComponent {
  @Input() extraHours: any[] = [];
  @Input() totalExtraHours: number = 0;
  @Input() currentPage: number = 1;
  @Input() pageSize: number = 10;
  @Input() isLoading: boolean = false;
  @Input() showActions: boolean = false;
  @Input() editExtraHourHandler: ((extraHour: ExtraHour) => void) = () => {};
  @Input() deleteExtraHourHandler: ((extraHour: ExtraHour) => void) = () => {};

  constructor(private router: Router, private extraHourService: ExtraHourService, private userAuth: UserAuth, private datePipe: DatePipe) { }

  getMonthAndDay(date: string): { day: number, month: string } {
    const partesData = date.split(' ')[0];
    const [day, month] = partesData.split('/').map(Number);
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const monthText = months[month - 1];

    return { day, month: monthText };
  }
  
}
