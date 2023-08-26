import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizeCustomersDataComponent } from './visualize-customers-data.component';

describe('VisualizeCustomersDataComponent', () => {
  let component: VisualizeCustomersDataComponent;
  let fixture: ComponentFixture<VisualizeCustomersDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizeCustomersDataComponent]
    });
    fixture = TestBed.createComponent(VisualizeCustomersDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
