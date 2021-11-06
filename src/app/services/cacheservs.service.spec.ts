import { TestBed } from '@angular/core/testing';

import { CacheservsService } from './cacheservs.service';

describe('CacheservsService', () => {
  let service: CacheservsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CacheservsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
