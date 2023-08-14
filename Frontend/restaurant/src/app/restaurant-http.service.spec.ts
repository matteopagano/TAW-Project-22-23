import { TestBed } from '@angular/core/testing';

import { RestaurantHttpService } from './restaurant-http.service';

describe('RestaurantHttpService', () => {
  let service: RestaurantHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestaurantHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
