import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FineCodeService } from '../fine-code-page/fine-code.service';

@Component({
  selector: 'app-fine-code-form',
  standalone: false,
  templateUrl: './fine-code-form.component.html',
  styleUrl: './fine-code-form.component.scss'
})
export class FineCodeFormComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: FineCodeService,
    private dialogRef: MatDialogRef<FineCodeFormComponent>
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      //fineNumber: [''],
      fineDescription: ['', [Validators.required, Validators.minLength(10)]],
      fineKm: [''],
      fineAlias: [''],
      fineOrder: [0, Validators.pattern("^[0-9]*$")] // Garante apenas números
    });
  }

  onSave(): void {
    if (this.form.valid) {
      this.service.create(this.form.value).subscribe({
        next: () => this.dialogRef.close(true), // Fecha e avisa que salvou
        error: (err) => console.error('Erro ao salvar:', err)
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
