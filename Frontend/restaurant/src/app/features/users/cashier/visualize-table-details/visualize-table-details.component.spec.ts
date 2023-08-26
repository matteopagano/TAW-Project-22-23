import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizeTableDetailsComponent } from './visualize-table-details.component';

describe('VisualizeTableDetailsComponent', () => {
  let component: VisualizeTableDetailsComponent;
  let fixture: ComponentFixture<VisualizeTableDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizeTableDetailsComponent]
    });
    fixture = TestBed.createComponent(VisualizeTableDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
