import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardInfoDateComponent } from './card-info-date.component';

describe('CardInfoDateComponent', () => {
  let component: CardInfoDateComponent;
  let fixture: ComponentFixture<CardInfoDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardInfoDateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardInfoDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
