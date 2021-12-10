import { TestBed } from '@angular/core/testing';

import { AlptablaService } from './alptabla.service';

describe('AlptablaService', () => {
  let service: AlptablaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlptablaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
