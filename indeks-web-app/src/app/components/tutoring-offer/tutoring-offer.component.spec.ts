import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoringOfferComponent } from './tutoring-offer.component';

describe('TutoringOfferComponent', () => {
  let component: TutoringOfferComponent;
  let fixture: ComponentFixture<TutoringOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutoringOfferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutoringOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
