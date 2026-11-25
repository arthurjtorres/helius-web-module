import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';

import { CameraTypeEnum, VehicleInterface, VehicleTypeInterface } from '../../../core/interfaces/vehicle.interface';
import CompanyInterface from '../../../core/interfaces/company.interface';
import { VehicleService } from '../../../core/services/vehicle.service';
import { VehicleTypeService } from '../../../core/services/vehicle-type.service';
import { CompanyService } from '../../../core/services/company.service';
import { NotificationService } from '../../../core/services/notification.service';

/** Ano de fabricação/modelo: 4 dígitos, de 1950 até o ano seguinte (mesma regra do `/vehicle/bulk`). */
export function yearValidator(control: AbstractControl): ValidationErrors | null {
  const value = String(control.value ?? '');
  if (!value) return null;
  const year = Number(value);
  return /^\d{4}$/.test(value) && year >= 1950 && year <= new Date().getFullYear() + 1 ? null : { year: true };
}

/**
 * Cadastro e edição de veículo (diálogo). Recebe o veículo da tabela para editar, ou nada para criar.
 * As regras de formato espelham as do `/vehicle/bulk`, para o formulário e a importação aceitarem o mesmo.
 */
@Component({
  selector: 'app-vehicles-form',
  standalone: false,
  templateUrl: './vehicles-form.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './vehicles-form.component.scss'
})
export class VehiclesFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  saving = false;
  companies: CompanyInterface[] = [];
  vehicleTypes: VehicleTypeInterface[] = [];
  readonly cameraTypes = Object.values(CameraTypeEnum);

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private vehicleTypeService: VehicleTypeService,
    private companyService: CompanyService,
    private notification: NotificationService,
    private dialogRef: MatDialogRef<VehiclesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VehicleInterface | null
  ) { }

  ngOnInit(): void {
    this.isEdit = !!this.data?.vehicleId;
    const v = this.data;
    this.form = this.fb.group({
      vehicleNumber: [v?.vehicleNumber ?? '', [Validators.required, Validators.maxLength(255)]],
      fkVehicleCompanyId: [v?.fkVehicleCompanyId ?? '', Validators.required],
      fkTypeVehicleId: [v?.fkTypeVehicleId ?? '', Validators.required],
      brand: [v?.brand ?? '', [Validators.required, Validators.maxLength(255)]],
      model: [v?.model ?? '', [Validators.required, Validators.maxLength(255)]],
      licensePlate: [v?.licensePlate ?? '', [Validators.required, Validators.pattern(/^[A-Za-z]{3}-?\d[A-Za-z0-9]\d{2}$/)]],
      chassisNumber: [v?.chassisNumber ?? '', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{8,25}$/)]],
      renavan: [v?.renavan ?? '', [Validators.required, Validators.pattern(/^\d{9,11}$/)]],
      fabricationYear: [v?.fabricationYear ?? '', [Validators.required, yearValidator]],
      modelYear: [v?.modelYear ?? '', [Validators.required, yearValidator]],
      capacity: [v?.capacity ?? null, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(1), Validators.max(300)]],
      hasWifi: [v?.hasWifi ?? false, Validators.required],
      cameraType: [v?.cameraType ?? '', Validators.required],
    });

    forkJoin({
      companies: this.loadList(this.companyService.getAll(), 'empresas'),
      vehicleTypes: this.loadList(this.vehicleTypeService.list(), 'tipos de veículo'),
    }).subscribe(({ companies, vehicleTypes }) => {
      this.companies = companies;
      this.vehicleTypes = vehicleTypes;
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

  onSave(): void {
    if (this.form.invalid || this.saving) return;
    const value = this.form.value;
    const payload: VehicleInterface = {
      ...value,
      vehicleNumber: String(value.vehicleNumber).trim(),
      licensePlate: String(value.licensePlate).toUpperCase(),
      chassisNumber: String(value.chassisNumber).toUpperCase(),
      fabricationYear: String(value.fabricationYear),
      modelYear: String(value.modelYear),
      capacity: Number(value.capacity),
    };

    this.saving = true;
    const request = this.isEdit
      ? this.vehicleService.updateVehicle(this.data!.vehicleId!, payload)
      : this.vehicleService.createVehicle(payload);

    request.subscribe({
      next: () => {
        this.notification.info(this.isEdit ? 'Veículo atualizado.' : 'Veículo cadastrado.');
        this.dialogRef.close(true);
      },
      error: (err: HttpErrorResponse) => {
        this.saving = false;
        this.showSaveError(err);
      }
    });
  }

  /** 409 vai para o campo em conflito (a mensagem do backend começa pelo rótulo do campo). */
  private showSaveError(err: HttpErrorResponse): void {
    const message: string = err.error?.message ?? '';
    if (err.status === 409) {
      const field = message.startsWith('Número') ? 'vehicleNumber' : message.startsWith('Placa') ? 'licensePlate' : null;
      if (field) {
        this.form.get(field)!.setErrors({ conflict: message });
        this.form.get(field)!.markAsTouched();
        return;
      }
    }
    if (err.status === 403) return;
    if (err.status === 400) return this.notification.error('Dados recusados pelo servidor. Confira os campos.');
    this.notification.error(message || 'Não foi possível salvar o veículo.');
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
