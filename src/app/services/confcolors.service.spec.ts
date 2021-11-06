import { TestBed } from '@angular/core/testing';

import { ConfcolorsService } from './confcolors.service';

describe('ConfcolorsService', () => {
  let service: ConfcolorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfcolorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
