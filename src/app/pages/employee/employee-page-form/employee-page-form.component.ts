import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../../core/services/employee.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeInterface } from '../../../core/interfaces/employee.interface';
import { DepartmentService } from '../../../core/services/department.service';
import { forkJoin } from 'rxjs';
import { CompanyService } from '../../../core/services/company.service';
import { PositionService } from '../../../core/services/position.service';
import { SectorService } from '../../../core/services/sector.service';

@Component({
  selector: 'app-employee-page-form',
  standalone: false,
  templateUrl: './employee-page-form.component.html',
  styleUrl: './employee-page-form.component.scss'
})
export class EmployeePageFormComponent implements OnInit {
  employeeForm!: FormGroup;
  isEdit: boolean = false;

  companies: any[] = [];
  positions: any[] = [];
  sectors: any[] = [];
  departments: any[] = [];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private companyService: CompanyService,
    private positionService: PositionService,
    private sectorService: SectorService,
    private departmentService: DepartmentService,
    private dialogRef: MatDialogRef<EmployeePageFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.isEdit = !!this.data;
    this.initForm();
    this.loadResources();
  }

  initForm() {
    this.employeeForm = this.fb.group({
      employeeId: [this.data?.employeeId || null],
      registration: [this.data?.registration || '', [Validators.required]],
      fullName: [this.data?.fullName || '', [Validators.required]],
      birthDate: [this.data?.birthDate || '', [Validators.required]],
      admissionDate: [this.data?.admissionDate || '', [Validators.required]],

      company: [this.data?.fkEmployeeCompanyId || '', [Validators.required]],
      position: [this.data?.fkEmployeePositionId || '', [Validators.required]],
      sector: [this.data?.fkSectorId || '', [Validators.required]],
      department: [this.data?.fkDepartmentId || '', [Validators.required]],
    })
  }

  loadResources() {
    forkJoin({
      companies: this.companyService.getAll(),
      positions: this.positionService.getAll(),
      sectors: this.sectorService.getAll(),
      departments: this.departmentService.getAll(),
    }).subscribe({
      next: (response: any) => {
        this.companies = response.companies.data;
        this.positions = response.positions.data;
        this.sectors = response.sectors.data;
        this.departments = response.departments.data;

        if (this.isEdit) {
          this.employeeForm.patchValue({
            company: this.data.fkEmployeeCompanyId,
            position: this.data.fkEmployeePositionId,
            sector: this.data.fkSectorId,
            department: this.data.fkDepartmentId
          });
        }
      }
    });
  }

  onSave(): void {

  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
