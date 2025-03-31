import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementaryGroupTableComponent } from './elementary-group-table.component';

describe('ElementaryGroupTableComponent', () => {
  let component: ElementaryGroupTableComponent;
  let fixture: ComponentFixture<ElementaryGroupTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElementaryGroupTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElementaryGroupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
