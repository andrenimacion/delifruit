import { TestBed } from '@angular/core/testing';

import { ControlModulesService } from './control-modules.service';

describe('ControlModulesService', () => {
  let service: ControlModulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlModulesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
