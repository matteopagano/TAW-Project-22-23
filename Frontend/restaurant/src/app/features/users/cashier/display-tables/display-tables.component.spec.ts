import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayTablesComponent } from './display-tables.component';

describe('DisplayTablesComponent', () => {
  let component: DisplayTablesComponent;
  let fixture: ComponentFixture<DisplayTablesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayTablesComponent]
    });
    fixture = TestBed.createComponent(DisplayTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
