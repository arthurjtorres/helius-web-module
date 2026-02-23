import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePageImportComponent } from './employee-page-import.component';

describe('EmployeePageImportComponent', () => {
  let component: EmployeePageImportComponent;
  let fixture: ComponentFixture<EmployeePageImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeePageImportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeePageImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
