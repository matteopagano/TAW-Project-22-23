import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayOrdersServedComponent } from './display-orders-served.component';

describe('DisplayOrdersServedComponent', () => {
  let component: DisplayOrdersServedComponent;
  let fixture: ComponentFixture<DisplayOrdersServedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayOrdersServedComponent]
    });
    fixture = TestBed.createComponent(DisplayOrdersServedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
