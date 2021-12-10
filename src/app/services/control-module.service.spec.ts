import { TestBed } from '@angular/core/testing';

import { ControlModuleService } from './control-module.service';

describe('ControlModuleService', () => {
  let service: ControlModuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlModuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
