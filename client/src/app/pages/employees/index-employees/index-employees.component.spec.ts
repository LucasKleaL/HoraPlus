import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexEmployeesComponent } from './index-employees.component';

describe('IndexEmployeesComponent', () => {
  let component: IndexEmployeesComponent;
  let fixture: ComponentFixture<IndexEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexEmployeesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
