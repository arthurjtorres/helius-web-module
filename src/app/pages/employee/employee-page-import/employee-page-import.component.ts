import { Component, inject, signal } from '@angular/core';
import { formatDate, SlicePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';

import { EmployeeService } from '../../../core/services/employee.service';
import { NotificationService } from '../../../core/services/notification.service';
import { readWorkbook } from '../../../core/utils/sheet-reader';
import { ImportReport, withFileLines } from '../../../shared/import-report/import-report.model';
import { OutsideItem, OutsideListComponent } from '../../../shared/outside-list/outside-list.component';
import { EmployeeFile, parseEmployeeSheet, parseEmployeeWorkbook, txtToSheet } from './employee-sheet';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatCard, MatCardHeader, MatCardSubtitle, MatCardContent, MatCardTitle } from '@angular/material/card';
import { CompanySelectComponent } from '../../../shared/company-select/company-select.component';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatProgressBar } from '@angular/material/progress-bar';
import { ImportReportComponent } from '../../../shared/import-report/import-report.component';
import { MatFormField, MatLabel, MatInput, MatHint } from '@angular/material/input';

/** Máximo de funcionários por requisição no `/employee/bulk` (a maior empresa tem ~5000). */
export const MAX_ROWS = 5000;
/** Linhas mostradas na pré-visualização (o relatório cobre todas). */
export const PREVIEW_ROWS = 100;

/** Texto do `.txt`: UTF-8 se válido, senão Windows-1252 (exportação comum de sistemas de RH). */
export function decodeText(data: ArrayBuffer): string {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(data);
  } catch {
    return new TextDecoder('windows-1252').decode(data);
  }
}

/**
 * Importação de funcionários por `.txt` do RH (largura fixa) ou planilha: pré-visualização,
 * simulação (`dryRun`) com relatório e diferenças a confirmar, e gravação em `upsert`, tudo ou nada,
 * numa requisição só. As regras de formato ficam com o backend (o `dryRun` aponta erro por linha).
 */
@Component({
    selector: 'app-employee-page-import',
    templateUrl: './employee-page-import.component.html',
    styleUrl: './employee-page-import.component.scss',
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatCard, MatCardHeader, MatCardSubtitle, MatCardContent, CompanySelectComponent, FormsModule, MatButton, MatIcon, MatCardTitle, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatProgressBar, ImportReportComponent, MatFormField, MatLabel, MatInput, MatHint, OutsideListComponent, MatDialogActions, SlicePipe]
})
export class EmployeePageImportComponent {
  private employeeService = inject(EmployeeService);
  private notification = inject(NotificationService);
  private dialogRef = inject<MatDialogRef<EmployeePageImportComponent>>(MatDialogRef);

  readonly previewRows = PREVIEW_ROWS;
  readonly previewColumns = ['line', 'registration', 'fullName', 'admissionDate', 'position', 'birthDate', 'cpf'];
  readonly fieldLabels: Record<string, string> = {
    registration: 'Matrícula', fullName: 'Nome', admissionDate: 'Admissão', position: 'Cargo', birthDate: 'Nascimento',
    cpf: 'CPF', companyId: 'Empresa', activated: 'Ativo',
  };
  companyId = '';
  readonly file = signal<EmployeeFile | undefined>(undefined);
  readonly report = signal<ImportReport | undefined>(undefined);
  confirmIds: string[] = [];
  readonly busy = signal(false);
  readonly imported = signal(false);
  /** Ativos da empresa fora do arquivo: informativo na simulação, desligáveis depois de importar (T19). */
  readonly outsideItems = signal<OutsideItem[]>([]);
  readonly deactivating = signal(false);
  /** Rescisão do lote: padrão hoje, no máximo amanhã (o backend confere também a admissão de cada um). */
  terminationDate = formatDate(Date.now(), 'yyyy-MM-dd', 'en-US');
  readonly maxTerminationDate = formatDate(Date.now() + 86_400_000, 'yyyy-MM-dd', 'en-US');

  async onFile(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      const data = await file.arrayBuffer();
      this.load(file.name.toLowerCase().endsWith('.txt')
        ? parseEmployeeSheet(txtToSheet(decodeText(data)))
        : parseEmployeeWorkbook(readWorkbook(data)));
    } catch {
      this.notification.error('Não foi possível ler o arquivo. Use o .txt do RH ou uma planilha .xlsx.');
    }
  }

  load(file: EmployeeFile): void {
    this.file.set(file);
    this.imported.set(false);
    this.changed();
  }

  /** O que impede simular (o resto o `dryRun` aponta). `null` = pode simular. */
  blocker(): string | null {
    const file = this.file();
    if (!file) return 'Escolha o arquivo.';
    if (file.error) return file.error;
    if (!file.rows.length) return 'Nenhuma linha com matrícula.';
    if (file.rows.length > MAX_ROWS) return `O arquivo tem ${file.rows.length} funcionários; o máximo por importação é ${MAX_ROWS}.`;
    if (!this.companyId) return 'Escolha a empresa.';
    return null;
  }

  /** Trocar empresa ou arquivo invalida a simulação anterior. */
  changed(): void {
    this.report.set(undefined);
    this.confirmIds = [];
    this.outsideItems.set([]);
  }

  /** Matrículas da lista "fora da planilha", para o relatório. */
  get outsideKeys(): string[] {
    return this.outsideItems().map(i => i.key);
  }

  canImport(): boolean {
    const r = this.report();
    return !!r && r.dryRun && !r.failed.length && !(r.missingPositions ?? []).length && !this.busy() && !this.blocker();
  }

  simulate(): void {
    this.send(true);
  }

  import(): void {
    this.send(false);
  }

  private send(dryRun: boolean): void {
    const file = this.file();
    if (this.blocker() || !file) return;
    const rows = file.rows;
    const lines = rows.map(r => r.line);
    this.busy.set(true);
    this.employeeService.bulkImport(this.companyId, rows.map(({ line, ...row }) => row), dryRun, dryRun ? [] : this.confirmIds).subscribe({
      next: res => {
        this.busy.set(false);
        const report = withFileLines(res.data, lines);
        this.report.set(report);
        if (!dryRun) this.imported.set(true);
        this.loadOutside(report);
      },
      error: (err: HttpErrorResponse) => {
        this.busy.set(false);
        if (err.status === 400 && err.error?.data) this.report.set(withFileLines(err.error.data, lines));
        else if (err.status !== 403) this.notification.error(err.error?.message || 'Não foi possível importar.');
      }
    });
  }

  /** Ativos da empresa cuja matrícula não está no relatório (o backend devolve a matrícula com sigla e 6 dígitos). */
  private loadOutside(report: ImportReport): void {
    const inFile = new Set([...report.created, ...(report.updated ?? []), ...(report.unchanged ?? []), ...report.skipped]
      .map(i => i['registration'] as string));
    this.employeeService.getByCompany(this.companyId).pipe(
      map(res => ((res.data ?? []) as { employeeId: string; registration: string }[])
        .filter(e => !inFile.has(e.registration)).map(e => ({ id: e.employeeId, key: e.registration }))),
      catchError(() => of([] as OutsideItem[])), // 404 = empresa sem funcionários
    ).subscribe(items => this.outsideItems.set(items));
  }

  /** Desliga em lote os marcados na lista "fora da planilha" (tudo ou nada), com a data de rescisão do campo. */
  deactivate(ids: string[]): void {
    this.deactivating.set(true);
    this.employeeService.bulkDeactivate(ids, this.terminationDate).subscribe({
      next: res => {
        this.deactivating.set(false);
        this.outsideItems.update(items => items.filter(i => !ids.includes(i.id)));
        // `control` fora: desligados, mas os usuários seguem ativos
        if (res.data?.pendingEmployeeIds?.length) this.notification.error(res.message);
        else this.notification.info(res.message || 'Funcionários desligados.');
      },
      error: (err: HttpErrorResponse) => {
        this.deactivating.set(false);
        if (err.status !== 403) this.notification.error(err.error?.message || 'Não foi possível desligar os funcionários.');
        const report = this.report();
        if (err.status === 409 && report) this.loadOutside(report);
      }
    });
  }

  close(): void {
    this.dialogRef.close(this.imported());
  }
}
