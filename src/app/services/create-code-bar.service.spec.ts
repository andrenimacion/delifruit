import { TestBed } from '@angular/core/testing';

import { CreateCodeBarService } from './create-code-bar.service';

describe('CreateCodeBarService', () => {
  let service: CreateCodeBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateCodeBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
