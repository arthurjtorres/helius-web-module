import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from '../../../core/services/employee.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { EmployeeView } from '../../../core/interfaces/employee.interface';
import PositionInterface from '../../../core/interfaces/position.interface';
import SectorInterface from '../../../core/interfaces/sector.interface';
import DepartmentInterface from '../../../core/interfaces/department.interface';
import { DepartmentService } from '../../../core/services/department.service';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { PositionService } from '../../../core/services/position.service';
import { SectorService } from '../../../core/services/sector.service';
import { DocumentService } from '../../../core/services/document.service';
import { DocumentTypeEnum } from '../../../core/interfaces/document.interface';
import { PersonService } from '../../../core/services/person.service';
import { NotificationService } from '../../../core/services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatLabel, MatInput, MatHint, MatError } from '@angular/material/input';
import { CompanySelectComponent } from '../../../shared/company-select/company-select.component';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-employee-page-form',
    templateUrl: './employee-page-form.component.html',
    styleUrl: './employee-page-form.component.scss',
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, FormsModule, ReactiveFormsModule, MatCard, MatFormField, MatLabel, MatInput, MatHint, CompanySelectComponent, MatSelect, MatOption, MatError, MatDialogActions, MatButton, MatIcon]
})
export class EmployeePageFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  private positionService = inject(PositionService);
  private sectorService = inject(SectorService);
  private departmentService = inject(DepartmentService);
  private documentService = inject(DocumentService);
  private personService = inject(PersonService);
  private notification = inject(NotificationService);
  private dialogRef = inject<MatDialogRef<EmployeePageFormComponent>>(MatDialogRef);
  data = inject<(EmployeeView & { cpf?: string }) | null>(MAT_DIALOG_DATA);

  employeeForm!: FormGroup;
  isEdit = false;

  readonly positions = signal<PositionInterface[]>([]);
  readonly sectors = signal<SectorInterface[]>([]);
  readonly departments = signal<DepartmentInterface[]>([]);

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
      // nome e sobrenome, como na importação (o registry exige lastName)
      fullName: [this.data?.fullName || '', [Validators.required, Validators.pattern(/\S+\s+\S+/)]],
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
      positions: this.loadList(this.positionService.getAll(), 'cargos'),
      sectors: this.loadList(this.sectorService.getAll(), 'setores'),
      departments: this.loadList(this.departmentService.getAll(), 'departamentos'),
    }).subscribe(({ positions, sectors, departments }) => {
      this.positions.set(positions);
      this.sectors.set(sectors);
      this.departments.set(departments);

      if (this.isEdit) {
        this.employeeForm.patchValue({
          position: this.data?.fkPositionId,
          sector: this.data?.fkSectorId,
          department: this.data?.fkDepartmentId
        });
      }
    });
  }

  /** Busca uma lista para os selects; 404 = vazia, 403 já avisado pelo interceptor. */
  private loadList<T>(request: Observable<{ data: T[] }>, label: string): Observable<T[]> {
    return request.pipe(
      map(res => res.data ?? []),
      catchError((err: HttpErrorResponse) => {
        if (err.status !== 404 && err.status !== 403) this.notification.error(`Não foi possível carregar ${label}.`);
        return of([]);
      })
    );
  }

  private createNewPersonAndDocument(raw: { fullName: string; birthDate: string; cpf: string }): Observable<string> {
    const nameParts = raw.fullName.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    const personPayload = {
      firstName,
      lastName,
      fullName: raw.fullName,
      birthDate: raw.birthDate
    };

    return this.personService.create(personPayload).pipe(
      switchMap(personRes => {
        const personId = personRes.data.personId;
        if (!personId) throw new Error('registry não devolveu o personId da pessoa criada');
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

        return this.isEdit && this.data
          // nome e nascimento são da pessoa; o registry os grava junto (T27). Na criação a API os recusa
          ? this.employeeService.update(this.data.employeeId, { ...employeePayload, fullName: raw.fullName, birthDate: raw.birthDate })
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
