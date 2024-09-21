import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexExtraHoursComponent } from './index-extra-hours.component';

describe('IndexExtraHoursComponent', () => {
  let component: IndexExtraHoursComponent;
  let fixture: ComponentFixture<IndexExtraHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexExtraHoursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexExtraHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
