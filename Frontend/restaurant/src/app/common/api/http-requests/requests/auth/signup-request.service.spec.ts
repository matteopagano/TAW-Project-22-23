import { TestBed } from '@angular/core/testing';

import { SignupRequestService } from './signup-request.service';

describe('SigninRequestService', () => {
  let service: SignupRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignupRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
