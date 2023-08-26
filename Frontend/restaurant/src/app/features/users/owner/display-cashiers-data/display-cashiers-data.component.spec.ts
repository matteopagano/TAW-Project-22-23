import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayCashiersDataComponent } from './display-cashiers-data.component';

describe('DisplayCashiersDataComponent', () => {
  let component: DisplayCashiersDataComponent;
  let fixture: ComponentFixture<DisplayCashiersDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayCashiersDataComponent]
    });
    fixture = TestBed.createComponent(DisplayCashiersDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
