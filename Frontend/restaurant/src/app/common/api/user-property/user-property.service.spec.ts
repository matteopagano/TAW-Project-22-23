import { TestBed } from '@angular/core/testing';

import { UserPropertyService } from './user-property.service';

describe('UserPropertyService', () => {
  let service: UserPropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserPropertyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
