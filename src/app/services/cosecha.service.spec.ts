import { TestBed } from '@angular/core/testing';

import { CosechaService } from './cosecha.service';

describe('CosechaService', () => {
  let service: CosechaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CosechaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
