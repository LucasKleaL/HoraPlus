import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuth } from 'src/app/auth/User.Auth';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() items: any[] = [];
  @Input() totalItems: number = 0;
  @Input() currentPage: number = 1;
  @Input() pageSize: number = 10;
  @Input() isLoading: boolean = false;
  @Input() showActions: boolean = false;
  @Input() cardTitle: string = '';
  @Input() cardDescription: string = '';
  @Input() cardInfos: { property: string, propertyPath: string, label: string, labelPostfix: string, color: boolean, colorTag: boolean }[] = [];
  @Input() editItemHandler: ((item: any) => void) = () => {};
  @Input() deleteItemHandler: ((item: any) => void) = () => {};

  constructor(private router: Router, private userAuth: UserAuth, private datePipe: DatePipe) { }

  ngOnInit(): void {
    console.log(this.items);
  }

  getNestedProperty(item: any, property: string, propertyPath: string, postfix: string): string {
    if (propertyPath === '') {
      return item[property] + postfix;
    }
    return item[property][propertyPath] + postfix;
  }
  
}
