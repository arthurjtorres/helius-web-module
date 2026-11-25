import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPageFormComponent } from './company-page-form.component';

describe('CompanyPageFormComponent', () => {
  let component: CompanyPageFormComponent;
  let fixture: ComponentFixture<CompanyPageFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CompanyPageFormComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(CompanyPageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
