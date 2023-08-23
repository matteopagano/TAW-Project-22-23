import { TestBed } from '@angular/core/testing';

import { SelfUserRequestService } from './self-user-request.service';

describe('SelfUserRequestService', () => {
  let service: SelfUserRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelfUserRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
