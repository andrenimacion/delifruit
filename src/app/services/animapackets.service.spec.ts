import { TestBed } from '@angular/core/testing';

import { AnimapacketsService } from './animapackets.service';

describe('AnimapacketsService', () => {
  let service: AnimapacketsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimapacketsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
