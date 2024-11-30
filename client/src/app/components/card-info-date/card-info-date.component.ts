import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-info-date',
  templateUrl: './card-info-date.component.html',
  styleUrls: ['./card-info-date.component.scss']
})
export class CardInfoDateComponent {
  @Input() items: any[] = [];
  @Input() totalItems: number = 0;
  @Input() currentPage: number = 1;
  @Input() pageSize: number = 10;
  @Input() isLoading: boolean = false;
  @Input() showActions: boolean = false;
  @Input() itemModelName: string ='';
  @Input() editItemHandler: ((item: any) => void) = () => {};
  @Input() deleteItemHandler: ((item: any) => void) = () => {};

  getMonthAndDay(date: string): { day: number, month: string } {
    const partesData = date.split(' ')[0];
    const [day, month] = partesData.split('/').map(Number);
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const monthText = months[month - 1];

    return { day, month: monthText };
  }
  
}
