import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayOrdersAwaitingComponent } from './display-orders-awaiting.component';

describe('DisplayOrdersAwaitingComponent', () => {
  let component: DisplayOrdersAwaitingComponent;
  let fixture: ComponentFixture<DisplayOrdersAwaitingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayOrdersAwaitingComponent]
    });
    fixture = TestBed.createComponent(DisplayOrdersAwaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
