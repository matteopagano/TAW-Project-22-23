import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayCooksDataComponent } from './display-cooks-data.component';

describe('DisplayCooksDataComponent', () => {
  let component: DisplayCooksDataComponent;
  let fixture: ComponentFixture<DisplayCooksDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayCooksDataComponent]
    });
    fixture = TestBed.createComponent(DisplayCooksDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
