import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexDaysOffComponent } from './index-days-off.component';

describe('IndexDaysOffComponent', () => {
  let component: IndexDaysOffComponent;
  let fixture: ComponentFixture<IndexDaysOffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexDaysOffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexDaysOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
