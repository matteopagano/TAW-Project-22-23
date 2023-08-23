import { TestBed } from '@angular/core/testing';

import { RecipesRequestService } from './recipes-request.service';

describe('RecipesRequestService', () => {
  let service: RecipesRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipesRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
