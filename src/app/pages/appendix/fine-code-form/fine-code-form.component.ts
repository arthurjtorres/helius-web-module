import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { FineCodeService } from '../../../core/services/fine-code.service';
import { FineCodeInterface } from '../../../core/interfaces/fine-code.interface';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-fine-code-form',
    templateUrl: './fine-code-form.component.html',
    styleUrl: './fine-code-form.component.scss',
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatDialogActions, MatButton, MatIcon]
})
export class FineCodeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(FineCodeService);
  private dialogRef = inject<MatDialogRef<FineCodeFormComponent>>(MatDialogRef);
  data = inject<FineCodeInterface>(MAT_DIALOG_DATA);

  form!: FormGroup;
  isEdit = false;

  ngOnInit(): void {
    this.isEdit = !!this.data;

    this.form = this.fb.group({
      fineNumber: [this.data?.fineNumber || ''],
      fineDescription: [this.data?.fineDescription || '', [Validators.required, Validators.minLength(10)]],
      fineKm: [this.data?.fineKm || ''],
      fineAlias: [this.data?.fineAlias || ''],
      fineOrder: [this.data?.fineOrder || null]
    });
  }

  onSave(): void {
    if (this.form.valid) {
      const payload = { ...this.form.value };

      if (this.isEdit && this.data.fineCodeId) {
        this.service.update(this.data.fineCodeId, payload).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => console.error('Erro ao editar:', err)
        });
      } else {
        Object.keys(payload).forEach(key => {
          const value = payload[key];
          if (value === '' || value === null || value === undefined) {
            delete payload[key];
          }
        });

        if (payload.fineOrder !== undefined) {
          payload.fineOrder = String(payload.fineOrder);
        }

        this.service.create(payload).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => console.error('Erro ao salvar:', err)
        });
      }

    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
