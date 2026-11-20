import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../../core/services/employee.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeView } from '../../../core/interfaces/employee.interface';
import { DepartmentService } from '../../../core/services/department.service';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { PositionService } from '../../../core/services/position.service';
import { SectorService } from '../../../core/services/sector.service';
import { DocumentService } from '../../../core/services/document.service';
import { DocumentTypeEnum } from '../../../core/interfaces/document.interface';
import { PersonService } from '../../../core/services/person.service';
import { NotificationService } from '../../../core/services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-employee-page-form',
  standalone: false,
  templateUrl: './employee-page-form.component.html',
  styleUrl: './employee-page-form.component.scss'
})
export class EmployeePageFormComponent implements OnInit {
  employeeForm!: FormGroup;
  isEdit: boolean = false;

  positions: any[] = [];
  sectors: any[] = [];
  departments: any[] = [];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private positionService: PositionService,
    private sectorService: SectorService,
    private departmentService: DepartmentService,
    private documentService: DocumentService,
    private personService: PersonService,
    private notification: NotificationService,
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
      personId: [this.data?.fkPersonId || null],
      cpf: [this.data?.cpf || '', [Validators.required]],

      employeeId: [this.data?.employeeId || null],
      registration: [this.data?.registration || '', [Validators.required]],
      fullName: [this.data?.fullName || '', [Validators.required]],
      birthDate: [this.data?.birthDate || '', [Validators.required]],
      admissionDate: [this.data?.admissionDate || '', [Validators.required]],

      company: [this.data?.fkCompanyId || '', [Validators.required]],
      position: [this.data?.fkPositionId || ''],
      sector: [this.data?.fkSectorId || ''],
      department: [this.data?.fkDepartmentId || ''],
    });

    if (this.isEdit) {
      this.employeeForm.get('cpf')?.disable();
      // troca de empresa é demissão e recontratação (T16); o backend também recusa
      this.employeeForm.get('company')?.disable();
    }
  }

  loadResources() {
    forkJoin({
      positions: this.positionService.getAll(),
      sectors: this.sectorService.getAll(),
      departments: this.departmentService.getAll(),
    }).subscribe({
      next: (response: any) => {
        this.positions = response.positions.data;
        this.sectors = response.sectors.data;
        this.departments = response.departments.data;

        if (this.isEdit) {
          this.employeeForm.patchValue({
            position: this.data.fkPositionId,
            sector: this.data.fkSectorId,
            department: this.data.fkDepartmentId
          });
        }
      }
    });
  }

  private createNewPersonAndDocument(raw: any): Observable<string> {
    const nameParts = raw.fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    const personPayload = {
      firstName,
      lastName,
      fullName: raw.fullName,
      birthDate: raw.birthDate
    };

    return this.personService.create(personPayload).pipe(
      switchMap((personRes: any) => {
        const personId = personRes.data.personId;
        const docPayload = {
          documentType: DocumentTypeEnum.CPF,
          documentNumber: raw.cpf,
          fkPersonId: personId
        };

        return this.documentService.create(docPayload).pipe(
          map(() => personId) 
        );
      })
    );
  }

  onSave(): void {
    if (this.employeeForm.invalid) return;

    const raw = this.employeeForm.getRawValue();

    const getPersonId$: Observable<string> = raw.personId 
      ? of(raw.personId) 
      : this.createNewPersonAndDocument(raw);

    getPersonId$.pipe(
      switchMap((personId: string) => {
        const employeePayload = {
          registration: raw.registration,
          admissionDate: raw.admissionDate,
          fkPersonId: personId,
          fkCompanyId: raw.company,
          // Opcionais como na API, que recusa '' (vazio sai do JSON)
          fkPositionId: raw.position || undefined,
          fkSectorId: raw.sector || undefined,
          fkDepartmentId: raw.department || undefined
          
        };

        return this.isEdit 
          ? this.employeeService.update(this.data.employeeId, employeePayload)
          : this.employeeService.create(employeePayload);
      })
    ).subscribe({
      next: () => this.dialogRef.close(true),
      // 400/409 do backend trazem a mensagem (empresa, matrícula ocupada); 403 já é avisado pelo interceptor
      error: (err: HttpErrorResponse) => {
        if (err.status !== 403) this.notification.error(err.error?.message || 'Não foi possível salvar o funcionário.');
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onCpfBlur() {
    const cpfValue = this.employeeForm.get('cpf')?.value;

    if (cpfValue && cpfValue.length === 11) {
      this.documentService.findDocuments({
        documentNumber: cpfValue,
        documentType: DocumentTypeEnum.CPF
      }).subscribe({
        next: (response) => {
          const docFound = response.data[0];

          if (docFound && docFound.Person) {
            const person = docFound.Person;

            this.employeeForm.patchValue({
              personId: person.personId,
              fullName: person.fullName,
              birthDate: person.birthDate ? person.birthDate.split('T')[0] : ''
            });

            this.employeeForm.get('fullName')?.disable();
            this.employeeForm.get('birthDate')?.disable();
          }
        },
        error: (err) => {
          if (err.status === 404) {
            this.employeeForm.get('personId')?.setValue(null);
            this.employeeForm.get('fullName')?.enable();
            this.employeeForm.get('birthDate')?.enable();
          }
        }
      });
    }
  }
}
