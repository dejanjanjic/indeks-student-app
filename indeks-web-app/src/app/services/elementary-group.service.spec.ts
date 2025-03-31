import { TestBed } from '@angular/core/testing';

import { ElementaryGroupService } from './elementary-group.service';

describe('ElementaryGroupService', () => {
  let service: ElementaryGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElementaryGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
