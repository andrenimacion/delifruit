import { TestBed } from '@angular/core/testing';

import { Dp08acalService } from './dp08acal.service';

describe('Dp08acalService', () => {
  let service: Dp08acalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Dp08acalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
