import { TestBed } from '@angular/core/testing';

import { ALPTABLAService } from './alptabla.service';

describe('ALPTABLAService', () => {
  let service: ALPTABLAService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ALPTABLAService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
