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
  filteredOptions!: Observable<any[]>;

  ngOnInit() {
    console.log(this.options);
    console.log(this.placeholder);
    this.filteredOptions = this.inputControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  displayFn(option: any): string {
    return option && option.title ? option.title : '';
  }

  private _filter(value: string): any[] {
    if (typeof value !== 'string') {
      return this.options;
    }
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.title.toLowerCase().includes(filterValue));
  }
}
