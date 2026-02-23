import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePageFormComponent } from './employee-page-form.component';

describe('EmployeePageFormComponent', () => {
  let component: EmployeePageFormComponent;
  let fixture: ComponentFixture<EmployeePageFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeePageFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeePageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
