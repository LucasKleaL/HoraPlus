import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExtraHoursComponent } from './add-extra-hours.component';

describe('AddExtraHoursComponent', () => {
  let component: AddExtraHoursComponent;
  let fixture: ComponentFixture<AddExtraHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExtraHoursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddExtraHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
