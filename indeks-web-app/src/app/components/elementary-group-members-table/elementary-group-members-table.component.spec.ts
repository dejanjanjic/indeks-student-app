import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementaryGroupMembersTableComponent } from './elementary-group-members-table.component';

describe('ElementaryGroupMembersTableComponent', () => {
  let component: ElementaryGroupMembersTableComponent;
  let fixture: ComponentFixture<ElementaryGroupMembersTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElementaryGroupMembersTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElementaryGroupMembersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
