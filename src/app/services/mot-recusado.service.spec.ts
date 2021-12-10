import { TestBed } from '@angular/core/testing';

import { MotRecusadoService } from './mot-recusado.service';

describe('MotRecusadoService', () => {
  let service: MotRecusadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MotRecusadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
