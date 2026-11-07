import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPageContentComponent } from './company-page-content.component';

describe('CompanyPageContentComponent', () => {
  let component: CompanyPageContentComponent;
  let fixture: ComponentFixture<CompanyPageContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyPageContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyPageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
