import { Component, OnInit } from '@angular/core';
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
import { ImportReport } from '../../../shared/import-report/import-report.model';
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
  outside: string[];
  busy: boolean;
  imported: boolean;
}

/**
 * Importação de veículos por planilha (uma aba por empresa): pré-visualização com Wi-Fi, câmera e
 * capacidade editáveis, simulação (`dryRun`) com relatório e diferenças a confirmar, e gravação em
 * `upsert`, tudo ou nada por aba. As regras de formato ficam com o backend (o `dryRun` aponta erro
 * por linha e campo); a tela só exige o que o backend não sabe dizer.
 */
@Component({
  selector: 'app-vehicles-import',
  standalone: false,
  templateUrl: './vehicles-import.component.html',
  styleUrl: './vehicles-import.component.scss'
})
export class VehiclesImportComponent implements OnInit {
  readonly cameraTypes = Object.values(CameraTypeEnum);
  readonly fieldLabels: Record<string, string> = {
    vehicleNumber: 'Prefixo', brand: 'Marca', model: 'Modelo', licensePlate: 'Placa', chassisNumber: 'Chassi',
    fabricationYear: 'Ano fab.', modelYear: 'Ano mod.', renavan: 'Renavam', typeVehicleName: 'Tipo',
    capacity: 'Capacidade', hasWifi: 'Wi-Fi', cameraType: 'Câmera', companyId: 'Empresa', activated: 'Ativo',
  };
  companies: CompanyInterface[] = [];
  sheets: SheetState[] = [];

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

  /** Monta o estado das abas, pré-selecionando a empresa pelo nome ou sigla da coluna `EMPRESA`. */
  load(sheets: VehicleSheet[]): void {
    this.sheets = sheets.map(sheet => {
      const key = normalizeText(sheet.companyName);
      const company = key ? this.companies.find(c => [c.companyName, c.companyAcronym].some(n => n && normalizeText(n) === key)) : undefined;
      return { sheet, companyId: company?.companyId ?? '', hasWifi: null, cameraType: null, confirmIds: [], outside: [], busy: false, imported: false };
    });
  }

  /** O que impede simular a aba (o resto o `dryRun` aponta). `null` = pode simular. */
  blocker(state: SheetState): string | null {
    const { sheet } = state;
    if (sheet.error) return sheet.error;
    if (!sheet.rows.length) return 'Nenhuma linha com prefixo.';
    if (sheet.rows.length > MAX_ROWS) return `A aba tem ${sheet.rows.length} veículos; o máximo por importação é ${MAX_ROWS}.`;
    if (!state.companyId) return 'Escolha a empresa.';
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
    state.busy = true;
    this.vehicleService.bulkImport(state.companyId, vehicles, dryRun, dryRun ? [] : state.confirmIds).subscribe({
      next: res => {
        state.busy = false;
        state.report = res.data;
        if (dryRun) this.loadOutside(state);
        else state.imported = true;
      },
      error: (err: HttpErrorResponse) => {
        state.busy = false;
        if (err.status === 400 && err.error?.data) state.report = err.error.data;
        else if (err.status !== 403) this.notification.error(err.error?.message || 'Não foi possível importar.');
      }
    });
  }

  /** Veículos ativos da empresa que não estão na aba (informativo; nada é desativado). */
  private loadOutside(state: SheetState): void {
    const inSheet = new Set(state.sheet.rows.map(r => r.vehicleNumber));
    this.vehicleService.getVehiclesByCompany(state.companyId).pipe(
      map(res => (res.data ?? []).map(v => v.vehicleNumber).filter(n => !inSheet.has(n))),
      catchError(() => of([])),
    ).subscribe(outside => state.outside = outside);
  }

  close(): void {
    this.dialogRef.close(this.sheets.some(s => s.imported));
  }
}
