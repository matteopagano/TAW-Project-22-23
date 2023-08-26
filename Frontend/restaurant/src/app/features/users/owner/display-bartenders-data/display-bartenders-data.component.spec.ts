import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayBartendersDataComponent } from './display-bartenders-data.component';

describe('DisplayBartendersDataComponent', () => {
  let component: DisplayBartendersDataComponent;
  let fixture: ComponentFixture<DisplayBartendersDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayBartendersDataComponent]
    });
    fixture = TestBed.createComponent(DisplayBartendersDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
