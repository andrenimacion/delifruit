import { TestBed } from '@angular/core/testing';

import { CreateCodebarService } from './create-codebar.service';

describe('CreateCodebarService', () => {
  let service: CreateCodebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateCodebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
