import { TestBed } from '@angular/core/testing';

import { RestaurantRequestService } from './restaurant-request.service';

describe('RestaurantRequestService', () => {
  let service: RestaurantRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestaurantRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
