import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayItemsComponent } from './display-items.component';

describe('DisplayItemsComponent', () => {
  let component: DisplayItemsComponent;
  let fixture: ComponentFixture<DisplayItemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayItemsComponent]
    });
    fixture = TestBed.createComponent(DisplayItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
