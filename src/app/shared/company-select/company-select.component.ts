import { Component, forwardRef, Input, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import CompanyInterface from '../../core/interfaces/company.interface';
import { CompanyService } from '../../core/services/company.service';
import { NotificationService } from '../../core/services/notification.service';
import { MatFormField, MatLabel, MatHint } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';

/**
 * Combobox de empresa (seleção única, valor = `companyId`), usado com `ngModel` ou `formControlName`.
 * Carrega as empresas do `GET /company` e pré-seleciona quando há uma só. Até a T18, lista as ativas;
 * depois, o backend devolve só as visíveis ao usuário, sem mudar este componente.
 */
@Component({
    selector: 'app-company-select',
    templateUrl: './company-select.component.html',
    styles: [':host { display: block; } .company-select { width: 100%; }'],
    changeDetection: ChangeDetectionStrategy.Eager,
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CompanySelectComponent), multi: true }],
    imports: [
        MatFormField,
        MatLabel,
        MatSelect,
        MatOption,
        MatHint,
    ],
})
export class CompanySelectComponent implements OnInit, ControlValueAccessor {
  private companyService = inject(CompanyService);
  private notification = inject(NotificationService);

  /** Dica mostrada enquanto nenhuma empresa está escolhida. */
  @Input() hint = '';
  companies: CompanyInterface[] = [];
  value = '';
  disabled = false;
  private onChange?: (value: string) => void;
  private onTouched?: () => void;

  ngOnInit(): void {
    this.companyService.getAll().subscribe({
      next: res => {
        this.companies = res.data ?? [];
        if (this.companies.length === 1 && !this.value && !this.disabled) this.select(this.companies[0].companyId ?? '');
      },
      error: (err: HttpErrorResponse) => {
        if (err.status !== 404 && err.status !== 403) this.notification.error('Não foi possível carregar as empresas.');
      }
    });
  }

  select(value: string): void {
    this.value = value;
    this.onChange?.(value);
    this.onTouched?.();
  }

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }
}
