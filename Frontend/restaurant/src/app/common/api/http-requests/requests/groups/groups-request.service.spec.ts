import { TestBed } from '@angular/core/testing';

import { GroupsRequestService } from './groups-request.service';

describe('GroupsRequestService', () => {
  let service: GroupsRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupsRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
