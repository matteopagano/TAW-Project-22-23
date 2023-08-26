import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizeCustomerDetailsComponent } from './visualize-customer-details.component';

describe('VisualizeCustomerDetailsComponent', () => {
  let component: VisualizeCustomerDetailsComponent;
  let fixture: ComponentFixture<VisualizeCustomerDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizeCustomerDetailsComponent]
    });
    fixture = TestBed.createComponent(VisualizeCustomerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
