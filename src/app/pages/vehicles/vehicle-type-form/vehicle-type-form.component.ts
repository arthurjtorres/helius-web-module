import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { VehicleTypeInterface } from '../../../core/interfaces/vehicle.interface';
import { VehicleTypeService } from '../../../core/services/vehicle-type.service';
import { NotificationService } from '../../../core/services/notification.service';
import { normalizeText } from '../../../core/utils/normalize-text';

/** Dados do diálogo: o tipo a editar (ou nada, para criar) e os tipos ativos, para checar nome duplicado. */
export interface VehicleTypeFormData {
  type?: VehicleTypeInterface;
  existing: VehicleTypeInterface[];
}

/**
 * Cadastro e edição de tipo de veículo. Bloqueia na tela nome igual a outro tipo ativo (comparação
 * sem acento e sem caixa, como a importação); o backend repete a checagem e, se o nome for de um
 * tipo inativo, devolve o id para reativar.
 */
@Component({
  selector: 'app-vehicle-type-form',
  standalone: false,
  templateUrl: './vehicle-type-form.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: '../vehicles-form/vehicles-form.component.scss'
})
export class VehicleTypeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(VehicleTypeService);
  private notification = inject(NotificationService);
  private dialogRef = inject<MatDialogRef<VehicleTypeFormComponent>>(MatDialogRef);
  data = inject<VehicleTypeFormData>(MAT_DIALOG_DATA);

  form!: FormGroup;
  isEdit = false;
  saving = false;

  ngOnInit(): void {
    const type = this.data.type;
    this.isEdit = !!type?.typeVehicleId;
    this.form = this.fb.group({
      typeVehicleName: [type?.typeVehicleName ?? '', [Validators.required, Validators.maxLength(255), this.uniqueName]],
      airConditioner: [type?.airConditioner ?? false, Validators.required],
    });
  }

  private uniqueName = (control: AbstractControl): ValidationErrors | null => {
    const key = normalizeText(String(control.value ?? ''));
    if (!key) return null;
    const taken = this.data.existing.some(t => t.typeVehicleId !== this.data.type?.typeVehicleId && normalizeText(t.typeVehicleName) === key);
    return taken ? { duplicate: true } : null;
  };

  onSave(): void {
    if (this.form.invalid || this.saving) return;
    const payload: VehicleTypeInterface = { ...this.form.value, typeVehicleName: String(this.form.value.typeVehicleName).trim() };
    this.saving = true;
    const request = this.isEdit
      ? this.service.update(this.data.type!.typeVehicleId!, payload)
      : this.service.create(payload);

    request.subscribe({
      next: () => this.done(this.isEdit ? 'Tipo de veículo atualizado.' : 'Tipo de veículo cadastrado.'),
      error: (err: HttpErrorResponse) => {
        this.saving = false;
        this.showSaveError(err);
      }
    });
  }

  /** 409 com `data.id`: o nome é de um tipo inativo; oferece reativá-lo no lugar de criar outro. */
  private showSaveError(err: HttpErrorResponse): void {
    const inactiveId: string | undefined = err.error?.data?.id;
    if (err.status === 409 && inactiveId) {
      if (confirm('Já existe um tipo de veículo inativo com este nome. Deseja reativá-lo?')) {
        this.service.reactivate(inactiveId).subscribe({
          next: () => this.done('Tipo de veículo reativado.'),
          error: (e: HttpErrorResponse) => {
            if (e.status !== 403) this.notification.error(e.error?.message || 'Não foi possível reativar.');
          }
        });
      }
      return;
    }
    if (err.status === 409) {
      this.form.get('typeVehicleName')!.setErrors({ duplicate: true });
      this.form.get('typeVehicleName')!.markAsTouched();
      return;
    }
    if (err.status === 403) return;
    if (err.status === 400) return this.notification.error('Dados recusados pelo servidor. Confira os campos.');
    this.notification.error(err.error?.message || 'Não foi possível salvar o tipo de veículo.');
  }

  private done(message: string): void {
    this.notification.info(message);
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
