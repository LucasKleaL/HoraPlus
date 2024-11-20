import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuth } from 'src/app/auth/User.Auth';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input() items: any[] = [];
  @Input() totalItems: number = 0;
  @Input() currentPage: number = 1;
  @Input() pageSize: number = 10;
  @Input() isLoading: boolean = false;
  @Input() showActions: boolean = false;
  @Input() cardTitle: string = '';
  @Input() titleProperty: string = '';
  @Input() titleLabel: string = '';
  @Input() descriptionProperty: string = '';
  @Input() descriptionLabel: string = '';
  @Input() tag1Property: string = '';
  @Input() tag1Label: string = '';
  @Input() tag2Property: string = '';
  @Input() tag2Label: string = '';
  @Input() editItemHandler: ((item: any) => void) = () => {};
  @Input() deleteItemHandler: ((item: any) => void) = () => {};

  constructor(private router: Router, private userAuth: UserAuth, private datePipe: DatePipe) { }

  ngOnInit(): void {
  }
  
}
