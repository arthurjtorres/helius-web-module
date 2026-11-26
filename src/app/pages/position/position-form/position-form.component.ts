import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';

import PositionInterface from '../../../core/interfaces/position.interface';
import { PositionService } from '../../../core/services/position.service';
import { NotificationService } from '../../../core/services/notification.service';
import { normalizeText } from '../../../core/utils/normalize-text';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatInput, MatError } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

/** Dados do diálogo: o cargo a editar (ou nada, para criar) e os cargos ativos, para checar nome duplicado. */
export interface PositionFormData {
  position?: PositionInterface;
  existing: PositionInterface[];
}

/**
 * Cadastro e edição de cargo. Bloqueia na tela nome igual a outro cargo ativo (comparação sem acento
 * e sem caixa, como a importação de funcionários); o backend repete a checagem e, se o nome for de um
 * cargo inativo, devolve o id para reativar. O código do cargo é gerado pelo banco.
 */
@Component({
    selector: 'app-position-form',
    templateUrl: './position-form.component.html',
    styleUrl: '../../vehicles/vehicles-form/vehicles-form.component.scss',
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatError, MatDialogActions, MatButton, MatIcon]
})
export class PositionFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(PositionService);
  private notification = inject(NotificationService);
  private dialogRef = inject<MatDialogRef<PositionFormComponent>>(MatDialogRef);
  data = inject<PositionFormData>(MAT_DIALOG_DATA);

  form!: FormGroup;
  isEdit = false;
  saving = signal(false);

  ngOnInit(): void {
    const position = this.data.position;
    this.isEdit = !!position?.positionId;
    this.form = this.fb.group({
      positionName: [position?.positionName ?? '', [Validators.required, Validators.maxLength(255), this.uniqueName]],
    });
  }

  private uniqueName = (control: AbstractControl): ValidationErrors | null => {
    const key = normalizeText(String(control.value ?? ''));
    if (!key) return null;
    const taken = this.data.existing.some(p => p.positionId !== this.data.position?.positionId && normalizeText(p.positionName) === key);
    return taken ? { duplicate: true } : null;
  };

  onSave(): void {
    if (this.form.invalid || this.saving()) return;
    const payload: PositionInterface = { positionName: String(this.form.value.positionName).trim() };
    this.saving.set(true);
    const request = this.isEdit
      ? this.service.update(this.data.position!.positionId!, payload)
      : this.service.create(payload);

    request.subscribe({
      next: () => this.done(this.isEdit ? 'Cargo atualizado.' : 'Cargo cadastrado.'),
      error: (err: HttpErrorResponse) => {
        this.saving.set(false);
        this.showSaveError(err);
      }
    });
  }

  /** 409 com `data.id`: o nome é de um cargo inativo; oferece reativá-lo no lugar de criar outro. */
  private showSaveError(err: HttpErrorResponse): void {
    const inactiveId: string | undefined = err.error?.data?.id;
    if (err.status === 409 && inactiveId) {
      if (confirm('Já existe um cargo inativo com este nome. Deseja reativá-lo?')) {
        this.service.reactivate(inactiveId).subscribe({
          next: () => this.done('Cargo reativado.'),
          error: (e: HttpErrorResponse) => {
            if (e.status !== 403) this.notification.error(e.error?.message || 'Não foi possível reativar.');
          }
        });
      }
      return;
    }
    if (err.status === 409) {
      this.form.get('positionName')!.setErrors({ duplicate: true });
      this.form.get('positionName')!.markAsTouched();
      return;
    }
    if (err.status === 403) return;
    if (err.status === 400) return this.notification.error('Dados recusados pelo servidor. Confira os campos.');
    this.notification.error(err.error?.message || 'Não foi possível salvar o cargo.');
  }

  private done(message: string): void {
    this.notification.info(message);
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
