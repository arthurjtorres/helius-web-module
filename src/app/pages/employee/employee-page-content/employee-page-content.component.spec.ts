import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePageContentComponent } from './employee-page-content.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeeModule } from '../employee.module';

describe('EmployeePageContentComponent', () => {
  let component: EmployeePageContentComponent;
  let fixture: ComponentFixture<EmployeePageContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeModule, NoopAnimationsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeePageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
