import { TestBed } from '@angular/core/testing';

import { TutoringOfferService } from './tutoring-offer.service';

describe('TutoringOfferService', () => {
  let service: TutoringOfferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TutoringOfferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
