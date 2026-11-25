import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { catchError, map, of } from 'rxjs';

import CompanyInterface from '../../../core/interfaces/company.interface';
import { CameraTypeEnum } from '../../../core/interfaces/vehicle.interface';
import { CompanyService } from '../../../core/services/company.service';
import { NotificationService } from '../../../core/services/notification.service';
import { VehicleService } from '../../../core/services/vehicle.service';
import { normalizeText } from '../../../core/utils/normalize-text';
import { readWorkbook } from '../../../core/utils/sheet-reader';
import { ImportReport, withFileLines } from '../../../shared/import-report/import-report.model';
import { OutsideItem } from '../../../shared/outside-list/outside-list.component';
import { VehicleRow, VehicleSheet, parseCapacity, parseVehicleSheet } from './vehicle-sheet';

/** Máximo de veículos por requisição no `/vehicle/bulk`. */
export const MAX_ROWS = 500;

/** Estado de uma aba: empresa, padrões de Wi-Fi/câmera e o último relatório (simulação ou gravação). */
export interface SheetState {
  sheet: VehicleSheet;
  companyId: string;
  hasWifi: boolean | null;
  cameraType: string | null;
  report?: ImportReport;
  confirmIds: string[];
  /** Prefixos ativos na base fora da aba (informativo na simulação). */
  outside: string[];
  /** Os mesmos, com id, para desativar depois de importar (T19). */
  outsideItems: OutsideItem[];
  deactivating: boolean;
  busy: boolean;
  imported: boolean;
}

/**
 * Importação de veículos de uma empresa por planilha de uma única aba: pré-visualização com Wi-Fi,
 * câmera e capacidade editáveis, simulação (`dryRun`) com relatório e diferenças a confirmar, e
 * gravação em `upsert`, tudo ou nada. As regras de formato ficam com o backend (o `dryRun` aponta erro
 * por linha e campo); a tela só exige o que o backend não sabe dizer.
 */
@Component({
  selector: 'app-vehicles-import',
  standalone: false,
  templateUrl: './vehicles-import.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './vehicles-import.component.scss'
})
export class VehiclesImportComponent implements OnInit {
  readonly cameraTypes = Object.values(CameraTypeEnum);
  readonly previewColumns = ['line', 'vehicleNumber', 'licensePlate', 'typeVehicleName', 'capacity', 'hasWifi', 'cameraType'];
  readonly fieldLabels: Record<string, string> = {
    vehicleNumber: 'Prefixo', brand: 'Marca', model: 'Modelo', licensePlate: 'Placa', chassisNumber: 'Chassi',
    fabricationYear: 'Ano fab.', modelYear: 'Ano mod.', renavan: 'Renavam', typeVehicleName: 'Tipo',
    capacity: 'Capacidade', hasWifi: 'Wi-Fi', cameraType: 'Câmera', companyId: 'Empresa', activated: 'Ativo',
  };
  companies: CompanyInterface[] = [];
  /** Empresa escolhida antes do arquivo (T16: uma empresa e uma aba por importação). */
  companyId = '';
  state?: SheetState;

  constructor(
    private vehicleService: VehicleService,
    private companyService: CompanyService,
    private notification: NotificationService,
    private dialogRef: MatDialogRef<VehiclesImportComponent>,
  ) { }

  ngOnInit(): void {
    this.companyService.getAll().subscribe({
      next: res => this.companies = res.data ?? [],
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
    this.state = undefined;
    if (sheets.length !== 1) {
      this.notification.error('O arquivo deve ter uma única aba.');
      return;
    }
    this.state = { sheet: sheets[0], companyId: this.companyId, hasWifi: null, cameraType: null, confirmIds: [], outside: [], outsideItems: [], deactivating: false, busy: false, imported: false };
  }

  /** Troca de empresa no combobox vale para a aba carregada e invalida a simulação. */
  companyChanged(): void {
    if (!this.state) return;
    this.state.companyId = this.companyId;
    this.changed(this.state);
  }

  /** A coluna `EMPRESA` da aba (nome ou sigla) não bate com a empresa escolhida. */
  private companyMismatch(state: SheetState): boolean {
    const key = normalizeText(state.sheet.companyName);
    const company = this.companies.find(c => c.companyId === state.companyId);
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
    state.report = undefined;
    state.confirmIds = [];
    state.outside = [];
  }

  canImport(state: SheetState): boolean {
    const r = state.report;
    return !!r && r.dryRun && !r.failed.length && !(r.missingVehicleTypes ?? []).length && !state.busy && !this.blocker(state);
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
    state.busy = true;
    this.vehicleService.bulkImport(state.companyId, vehicles, dryRun, dryRun ? [] : state.confirmIds).subscribe({
      next: res => {
        state.busy = false;
        state.report = withFileLines(res.data, lines);
        if (!dryRun) state.imported = true;
        this.loadOutside(state);
      },
      error: (err: HttpErrorResponse) => {
        state.busy = false;
        if (err.status === 400 && err.error?.data) state.report = withFileLines(err.error.data, lines);
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
      state.outsideItems = items;
      state.outside = items.map(i => i.key);
    });
  }

  /** Desativa em lote os veículos marcados na lista "fora da planilha" (tudo ou nada). */
  deactivate(state: SheetState, ids: string[]): void {
    state.deactivating = true;
    this.vehicleService.bulkDeactivate(ids).subscribe({
      next: res => {
        state.deactivating = false;
        state.outsideItems = state.outsideItems.filter(i => !ids.includes(i.id));
        this.notification.info(res.message || 'Veículos desativados.');
      },
      error: (err: HttpErrorResponse) => {
        state.deactivating = false;
        if (err.status !== 403) this.notification.error(err.error?.message || 'Não foi possível desativar os veículos.');
        if (err.status === 409) this.loadOutside(state);
      }
    });
  }

  close(): void {
    this.dialogRef.close(!!this.state?.imported);
  }
}
