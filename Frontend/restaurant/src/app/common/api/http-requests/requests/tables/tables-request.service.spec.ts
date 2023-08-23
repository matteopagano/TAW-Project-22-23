import { TestBed } from '@angular/core/testing';

import { TablesRequestService } from './tables-request.service';

describe('TablesRequestService', () => {
  let service: TablesRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TablesRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
