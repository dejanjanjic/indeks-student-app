import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddElementayGroupComponent } from './add-elementay-group.component';

describe('AddElementayGroupComponent', () => {
  let component: AddElementayGroupComponent;
  let fixture: ComponentFixture<AddElementayGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddElementayGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddElementayGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
