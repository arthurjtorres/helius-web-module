import { Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { catchError, map, of } from 'rxjs';

import CompanyInterface from '../../../core/interfaces/company.interface';
import { CameraTypeEnum } from '../../../core/interfaces/vehicle.interface';
import { CompanyService } from '../../../core/services/company.service';
import { NotificationService } from '../../../core/services/notification.service';
import { VehicleService } from '../../../core/services/vehicle.service';
import { normalizeText } from '../../../core/utils/normalize-text';
import { readWorkbook } from '../../../core/utils/sheet-reader';
import { ImportReport, withFileLines } from '../../../shared/import-report/import-report.model';
import { OutsideItem, OutsideListComponent } from '../../../shared/outside-list/outside-list.component';
import { VehicleRow, VehicleSheet, parseCapacity, parseVehicleSheet } from './vehicle-sheet';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatCard, MatCardHeader, MatCardSubtitle, MatCardContent, MatCardTitle } from '@angular/material/card';
import { CompanySelectComponent } from '../../../shared/company-select/company-select.component';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatProgressBar } from '@angular/material/progress-bar';
import { ImportReportComponent } from '../../../shared/import-report/import-report.component';

/** Máximo de veículos por requisição no `/vehicle/bulk`. */
export const MAX_ROWS = 500;

/** Estado de uma aba: empresa, padrões de Wi-Fi/câmera e o último relatório (simulação ou gravação). */
export interface SheetState {
  sheet: VehicleSheet;
  companyId: string;
  hasWifi: boolean | null;
  cameraType: string | null;
  /** Signals: gravados em callbacks assíncronos (OnPush). */
  report: WritableSignal<ImportReport | undefined>;
  confirmIds: string[];
  /** Prefixos ativos na base fora da aba (informativo na simulação). */
  outside: WritableSignal<string[]>;
  /** Os mesmos, com id, para desativar depois de importar (T19). */
  outsideItems: WritableSignal<OutsideItem[]>;
  deactivating: WritableSignal<boolean>;
  busy: WritableSignal<boolean>;
  imported: WritableSignal<boolean>;
}

/**
 * Importação de veículos de uma empresa por planilha de uma única aba: pré-visualização com Wi-Fi,
 * câmera e capacidade editáveis, simulação (`dryRun`) com relatório e diferenças a confirmar, e
 * gravação em `upsert`, tudo ou nada. As regras de formato ficam com o backend (o `dryRun` aponta erro
 * por linha e campo); a tela só exige o que o backend não sabe dizer.
 */
@Component({
    selector: 'app-vehicles-import',
    templateUrl: './vehicles-import.component.html',
    styleUrl: './vehicles-import.component.scss',
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatCard, MatCardHeader, MatCardSubtitle, MatCardContent, CompanySelectComponent, FormsModule, MatButton, MatIcon, MatCardTitle, MatFormField, MatLabel, MatSelect, MatOption, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatInput, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatProgressBar, ImportReportComponent, OutsideListComponent, MatDialogActions]
})
export class VehiclesImportComponent implements OnInit {
  private vehicleService = inject(VehicleService);
  private companyService = inject(CompanyService);
  private notification = inject(NotificationService);
  private dialogRef = inject<MatDialogRef<VehiclesImportComponent>>(MatDialogRef);

  readonly cameraTypes = Object.values(CameraTypeEnum);
  readonly previewColumns = ['line', 'vehicleNumber', 'licensePlate', 'typeVehicleName', 'capacity', 'hasWifi', 'cameraType'];
  readonly fieldLabels: Record<string, string> = {
    vehicleNumber: 'Prefixo', brand: 'Marca', model: 'Modelo', licensePlate: 'Placa', chassisNumber: 'Chassi',
    fabricationYear: 'Ano fab.', modelYear: 'Ano mod.', renavan: 'Renavam', typeVehicleName: 'Tipo',
    capacity: 'Capacidade', hasWifi: 'Wi-Fi', cameraType: 'Câmera', companyId: 'Empresa', activated: 'Ativo',
  };
  readonly companies = signal<CompanyInterface[]>([]);
  /** Empresa escolhida antes do arquivo (T16: uma empresa e uma aba por importação). */
  companyId = '';
  readonly state = signal<SheetState | undefined>(undefined);

  ngOnInit(): void {
    this.companyService.getAll().subscribe({
      next: res => this.companies.set(res.data ?? []),
      error: (err: HttpErrorResponse) => {
        if (err.status !== 404 && err.status !== 403) this.notification.error('Não foi possível carregar as empresas.');
      }
    });
  }

  async onFile(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      this.load(readWorkbook(await file.arrayBuffer()).map(parseVehicleSheet));
    } catch {
      this.notification.error('Não foi possível ler o arquivo. Use uma planilha .xlsx.');
    }
  }

  /** Aceita só arquivo de uma aba; a empresa vem do combobox. */
  load(sheets: VehicleSheet[]): void {
    this.state.set(undefined);
    if (sheets.length !== 1) {
      this.notification.error('O arquivo deve ter uma única aba.');
      return;
    }
    this.state.set({
      sheet: sheets[0], companyId: this.companyId, hasWifi: null, cameraType: null, confirmIds: [], report: signal(undefined),
      outside: signal([]), outsideItems: signal([]), deactivating: signal(false), busy: signal(false), imported: signal(false),
    });
  }

  /** Troca de empresa no combobox vale para a aba carregada e invalida a simulação. */
  companyChanged(): void {
    const state = this.state();
    if (!state) return;
    state.companyId = this.companyId;
    this.changed(state);
  }

  /** A coluna `EMPRESA` da aba (nome ou sigla) não bate com a empresa escolhida. */
  private companyMismatch(state: SheetState): boolean {
    const key = normalizeText(state.sheet.companyName);
    const company = this.companies().find(c => c.companyId === state.companyId);
    return !!key && !!company && ![company.companyName, company.companyAcronym].some(n => n && normalizeText(n) === key);
  }

  /** O que impede simular a aba (o resto o `dryRun` aponta). `null` = pode simular. */
  blocker(state: SheetState): string | null {
    const { sheet } = state;
    if (sheet.error) return sheet.error;
    if (!sheet.rows.length) return 'Nenhuma linha com prefixo.';
    if (sheet.rows.length > MAX_ROWS) return `O arquivo tem ${sheet.rows.length} veículos; o máximo por importação é ${MAX_ROWS}.`;
    if (!state.companyId) return 'Escolha a empresa.';
    if (this.companyMismatch(state)) return `A coluna EMPRESA da planilha indica "${sheet.companyName}"; confira a empresa escolhida.`;
    if (sheet.rows.some(r => this.badCapacity(r))) return 'Preencha a capacidade (1 a 300) das linhas destacadas.';
    if (sheet.rows.some(r => (r.hasWifi ?? state.hasWifi) === null)) return 'Escolha o Wi-Fi padrão.';
    if (sheet.rows.some(r => !(r.cameraType ?? state.cameraType))) return 'Escolha a câmera padrão.';
    return null;
  }

  badCapacity(row: VehicleRow): boolean {
    return parseCapacity(row.capacity) === null;
  }

  /** Qualquer edição invalida a simulação anterior. */
  changed(state: SheetState): void {
    state.report.set(undefined);
    state.confirmIds = [];
    state.outside.set([]);
  }

  canImport(state: SheetState): boolean {
    const r = state.report();
    return !!r && r.dryRun && !r.failed.length && !(r.missingVehicleTypes ?? []).length && !state.busy() && !this.blocker(state);
  }

  simulate(state: SheetState): void {
    this.send(state, true);
  }

  import(state: SheetState): void {
    this.send(state, false);
  }

  private send(state: SheetState, dryRun: boolean): void {
    if (this.blocker(state)) return;
    const vehicles = state.sheet.rows.map(({ line, ...row }) => ({
      ...row, hasWifi: row.hasWifi ?? state.hasWifi, cameraType: row.cameraType ?? state.cameraType,
    }));
    const lines = state.sheet.rows.map(r => r.line);
    state.busy.set(true);
    this.vehicleService.bulkImport(state.companyId, vehicles, dryRun, dryRun ? [] : state.confirmIds).subscribe({
      next: res => {
        state.busy.set(false);
        state.report.set(withFileLines(res.data, lines));
        if (!dryRun) state.imported.set(true);
        this.loadOutside(state);
      },
      error: (err: HttpErrorResponse) => {
        state.busy.set(false);
        if (err.status === 400 && err.error?.data) state.report.set(withFileLines(err.error.data, lines));
        else if (err.status !== 403) this.notification.error(err.error?.message || 'Não foi possível importar.');
      }
    });
  }

  /** Veículos ativos da empresa que não estão na aba: informativo na simulação, desativáveis depois de importar. */
  private loadOutside(state: SheetState): void {
    const inSheet = new Set(state.sheet.rows.map(r => r.vehicleNumber));
    this.vehicleService.getVehiclesByCompany(state.companyId).pipe(
      map(res => (res.data ?? []).filter(v => v.vehicleId && !inSheet.has(v.vehicleNumber)).map(v => ({ id: v.vehicleId!, key: v.vehicleNumber }))),
      catchError(() => of([] as OutsideItem[])),
    ).subscribe(items => {
      state.outsideItems.set(items);
      state.outside.set(items.map(i => i.key));
    });
  }

  /** Desativa em lote os veículos marcados na lista "fora da planilha" (tudo ou nada). */
  deactivate(state: SheetState, ids: string[]): void {
    state.deactivating.set(true);
    this.vehicleService.bulkDeactivate(ids).subscribe({
      next: res => {
        state.deactivating.set(false);
        state.outsideItems.update(items => items.filter(i => !ids.includes(i.id)));
        this.notification.info(res.message || 'Veículos desativados.');
      },
      error: (err: HttpErrorResponse) => {
        state.deactivating.set(false);
        if (err.status !== 403) this.notification.error(err.error?.message || 'Não foi possível desativar os veículos.');
        if (err.status === 409) this.loadOutside(state);
      }
    });
  }

  close(): void {
    this.dialogRef.close(!!this.state()?.imported());
  }
}
