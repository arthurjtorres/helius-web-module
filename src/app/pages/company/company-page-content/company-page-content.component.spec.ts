import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPageContentComponent } from './company-page-content.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CompanyModule } from '../company.module';

describe('CompanyPageContentComponent', () => {
  let component: CompanyPageContentComponent;
  let fixture: ComponentFixture<CompanyPageContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyModule, NoopAnimationsModule]
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
