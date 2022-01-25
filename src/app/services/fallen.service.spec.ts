import { TestBed } from '@angular/core/testing';

import { FallenService } from './fallen.service';

describe('FallenService', () => {
  let service: FallenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FallenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
