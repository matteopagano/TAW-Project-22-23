import { TestBed } from '@angular/core/testing';

import { ItemsRequestService } from './items-request.service';

describe('ItemsRequestService', () => {
  let service: ItemsRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemsRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
