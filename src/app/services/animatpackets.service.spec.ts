import { TestBed } from '@angular/core/testing';

import { AnimatpacketsService } from './animatpackets.service';

describe('AnimatpacketsService', () => {
  let service: AnimatpacketsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimatpacketsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
