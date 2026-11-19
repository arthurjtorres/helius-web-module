import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';

import CompanyInterface from '../../../core/interfaces/company.interface';
import { CompanyService } from '../../../core/services/company.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { NotificationService } from '../../../core/services/notification.service';
import { readWorkbook } from '../../../core/utils/sheet-reader';
import { ImportReport, withFileLines } from '../../../shared/import-report/import-report.model';
import { EmployeeFile, parseEmployeeSheet, parseEmployeeWorkbook, txtToSheet } from './employee-sheet';

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
  standalone: false,
  templateUrl: './employee-page-import.component.html',
  styleUrl: './employee-page-import.component.scss'
})
export class EmployeePageImportComponent implements OnInit {
  readonly previewRows = PREVIEW_ROWS;
  readonly previewColumns = ['line', 'registration', 'fullName', 'admissionDate', 'position', 'birthDate', 'cpf'];
  readonly fieldLabels: Record<string, string> = {
    registration: 'Matrícula', fullName: 'Nome', admissionDate: 'Admissão', position: 'Cargo', birthDate: 'Nascimento',
    cpf: 'CPF', companyId: 'Empresa', activated: 'Ativo',
  };
  companies: CompanyInterface[] = [];
  companyId = '';
  file?: EmployeeFile;
  report?: ImportReport;
  confirmIds: string[] = [];
  busy = false;
  imported = false;

  constructor(
    private employeeService: EmployeeService,
    private companyService: CompanyService,
    private notification: NotificationService,
    private dialogRef: MatDialogRef<EmployeePageImportComponent>,
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
      const data = await file.arrayBuffer();
      this.load(file.name.toLowerCase().endsWith('.txt')
        ? parseEmployeeSheet(txtToSheet(decodeText(data)))
        : parseEmployeeWorkbook(readWorkbook(data)));
    } catch {
      this.notification.error('Não foi possível ler o arquivo. Use o .txt do RH ou uma planilha .xlsx.');
    }
  }

  load(file: EmployeeFile): void {
    this.file = file;
    this.imported = false;
    this.changed();
  }

  /** O que impede simular (o resto o `dryRun` aponta). `null` = pode simular. */
  blocker(): string | null {
    if (!this.file) return 'Escolha o arquivo.';
    if (this.file.error) return this.file.error;
    if (!this.file.rows.length) return 'Nenhuma linha com matrícula.';
    if (this.file.rows.length > MAX_ROWS) return `O arquivo tem ${this.file.rows.length} funcionários; o máximo por importação é ${MAX_ROWS}.`;
    if (!this.companyId) return 'Escolha a empresa.';
    return null;
  }

  /** Trocar empresa ou arquivo invalida a simulação anterior. */
  changed(): void {
    this.report = undefined;
    this.confirmIds = [];
  }

  canImport(): boolean {
    const r = this.report;
    return !!r && r.dryRun && !r.failed.length && !(r.missingPositions ?? []).length && !this.busy && !this.blocker();
  }

  simulate(): void {
    this.send(true);
  }

  import(): void {
    this.send(false);
  }

  private send(dryRun: boolean): void {
    if (this.blocker() || !this.file) return;
    const rows = this.file.rows;
    const lines = rows.map(r => r.line);
    this.busy = true;
    this.employeeService.bulkImport(this.companyId, rows.map(({ line, ...row }) => row), dryRun, dryRun ? [] : this.confirmIds).subscribe({
      next: res => {
        this.busy = false;
        this.report = withFileLines(res.data, lines);
        if (!dryRun) this.imported = true;
      },
      error: (err: HttpErrorResponse) => {
        this.busy = false;
        if (err.status === 400 && err.error?.data) this.report = withFileLines(err.error.data, lines);
        else if (err.status !== 403) this.notification.error(err.error?.message || 'Não foi possível importar.');
      }
    });
  }

  close(): void {
    this.dialogRef.close(this.imported);
  }
}
