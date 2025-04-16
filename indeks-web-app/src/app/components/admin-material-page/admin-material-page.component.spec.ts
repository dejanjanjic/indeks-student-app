import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMaterialPageComponent } from './admin-material-page.component';

describe('AdminMaterialPageComponent', () => {
  let component: AdminMaterialPageComponent;
  let fixture: ComponentFixture<AdminMaterialPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMaterialPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMaterialPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
