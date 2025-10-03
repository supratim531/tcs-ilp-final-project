import { TestBed } from '@angular/core/testing';

import { BackendUtilService } from './backend-util.service';

describe('BackendUtilService', () => {
  let service: BackendUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
