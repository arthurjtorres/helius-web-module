import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FineCodeService } from '../fine-code-page/fine-code.service';
import { FineCodeInterface } from '../fine-code-page/fine-code.interface';

@Component({
  selector: 'app-fine-code-form',
  standalone: false,
  templateUrl: './fine-code-form.component.html',
  styleUrl: './fine-code-form.component.scss'
})
export class FineCodeFormComponent implements OnInit {
  form!: FormGroup;
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private service: FineCodeService,
    private dialogRef: MatDialogRef<FineCodeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FineCodeInterface
  ) { }

  ngOnInit(): void {
    this.isEdit = !!this.data;

    this.form = this.fb.group({
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
