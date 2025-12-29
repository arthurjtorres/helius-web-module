import { TestBed } from '@angular/core/testing';

import { FineCodeService } from './fine-code.service';

describe('FineCodeService', () => {
  let service: FineCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FineCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
