import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayWaitersDataComponent } from './display-waiters-data.component';

describe('DisplayWaitersDataComponent', () => {
  let component: DisplayWaitersDataComponent;
  let fixture: ComponentFixture<DisplayWaitersDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayWaitersDataComponent]
    });
    fixture = TestBed.createComponent(DisplayWaitersDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
