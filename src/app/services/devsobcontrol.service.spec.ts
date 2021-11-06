import { TestBed } from '@angular/core/testing';

import { DevsobcontrolService } from './devsobcontrol.service';

describe('DevsobcontrolService', () => {
  let service: DevsobcontrolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevsobcontrolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
