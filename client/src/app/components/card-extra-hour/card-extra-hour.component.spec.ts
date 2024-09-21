import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardExtraHourComponent } from './card-extra-hour.component';

describe('CardExtraHourComponent', () => {
  let component: CardExtraHourComponent;
  let fixture: ComponentFixture<CardExtraHourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardExtraHourComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardExtraHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
