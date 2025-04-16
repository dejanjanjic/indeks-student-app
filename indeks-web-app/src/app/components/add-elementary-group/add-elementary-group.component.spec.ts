import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddElementaryGroupComponent } from './add-elementary-group.component';

describe('AddElementaryGroupComponent', () => {
  let component: AddElementaryGroupComponent;
  let fixture: ComponentFixture<AddElementaryGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddElementaryGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddElementaryGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
