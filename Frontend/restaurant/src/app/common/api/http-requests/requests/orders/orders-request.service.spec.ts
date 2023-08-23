import { TestBed } from '@angular/core/testing';

import { OrdersRequestService } from './orders-request.service';

describe('OrdersRequestService', () => {
  let service: OrdersRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdersRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
