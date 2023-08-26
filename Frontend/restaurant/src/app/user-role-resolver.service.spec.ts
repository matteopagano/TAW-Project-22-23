import { TestBed } from '@angular/core/testing';

import { UserRoleResolverService } from './user-role-resolver.service';

describe('UserRoleResolverService', () => {
  let service: UserRoleResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserRoleResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
