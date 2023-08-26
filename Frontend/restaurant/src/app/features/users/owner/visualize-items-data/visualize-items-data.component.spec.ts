import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizeItemsDataComponent } from './visualize-items-data.component';

describe('VisualizeItemsDataComponent', () => {
  let component: VisualizeItemsDataComponent;
  let fixture: ComponentFixture<VisualizeItemsDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizeItemsDataComponent]
    });
    fixture = TestBed.createComponent(VisualizeItemsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
