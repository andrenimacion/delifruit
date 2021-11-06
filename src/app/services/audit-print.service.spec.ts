import { TestBed } from '@angular/core/testing';

import { AuditPrintService } from './audit-print.service';

describe('AuditPrintService', () => {
  let service: AuditPrintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditPrintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
