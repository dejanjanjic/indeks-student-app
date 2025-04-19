import { TestBed } from '@angular/core/testing';

import { ElementaryGroupChatMemberService } from './elementary-group-chat-member.service';

describe('ElementaryGroupChatMemberService', () => {
  let service: ElementaryGroupChatMemberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElementaryGroupChatMemberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
