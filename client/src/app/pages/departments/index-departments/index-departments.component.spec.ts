import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexDepartmentsComponent } from './index-departments.component';

describe('IndexDepartmentsComponent', () => {
  let component: IndexDepartmentsComponent;
  let fixture: ComponentFixture<IndexDepartmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexDepartmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexDepartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
