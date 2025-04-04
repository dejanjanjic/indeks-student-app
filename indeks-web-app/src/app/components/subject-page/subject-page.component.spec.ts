import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectPageComponent } from './subject-page.component';

describe('SubjectPageComponent', () => {
  let component: SubjectPageComponent;
  let fixture: ComponentFixture<SubjectPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
