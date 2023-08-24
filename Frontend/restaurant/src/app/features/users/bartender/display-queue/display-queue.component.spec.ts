import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayQueueComponent } from './display-queue.component';

describe('DisplayQueueComponent', () => {
  let component: DisplayQueueComponent;
  let fixture: ComponentFixture<DisplayQueueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayQueueComponent]
    });
    fixture = TestBed.createComponent(DisplayQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
