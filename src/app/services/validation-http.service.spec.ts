import { TestBed } from '@angular/core/testing';

import { ValidationHttpService } from './validation-http.service';

describe('ValidationHttpService', () => {
  let service: ValidationHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
