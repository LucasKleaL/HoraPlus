import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-input-autocomplete',
  templateUrl: './input-autocomplete.component.html',
  styleUrls: ['./input-autocomplete.component.css']
})
export class InputAutocompleteComponent implements OnInit {

  @Input() options: any[] = [];
  @Input() placeholder: string = '';
  @Input() inputControl!: FormControl;
  @Input() formDir!: any;
  @Input() displayProperty: string = 'title';
  filteredOptions!: Observable<any[]>;

  ngOnInit() {
    this.filteredOptions = this.inputControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  displayFn = (option: any): string => {
    return option && option[this.displayProperty] ? option[this.displayProperty] : '';
  }

  private _filter(value: string): any[] {
    if (typeof value !== 'string') {
      return this.options;
    }
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option[this.displayProperty].toLowerCase().includes(filterValue));
  }
}
