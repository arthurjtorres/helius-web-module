import { Component, EventEmitter, Input, OnChanges, Output, ChangeDetectionStrategy } from '@angular/core';
import { ImportFieldChange, ImportItem, ImportReport } from './import-report.model';
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent } from '@angular/material/card';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatChipSet, MatChip } from '@angular/material/chips';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatList, MatListItem, MatListItemTitle, MatListItemLine } from '@angular/material/list';

/**
 * Relatório de uma importação em lote (simulação ou gravação): contagens, falhas por linha,
 * diferenças a confirmar (modo `upsert`), cadastros ausentes e registros da base fora da planilha.
 * Serve a veículos e funcionários; os nomes dos campos vêm por input.
 */
@Component({
    selector: 'app-import-report',
    templateUrl: './import-report.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './import-report.component.scss',
    imports: [MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatChipSet, MatChip, MatCheckbox, MatList, MatListItem, MatListItemTitle, MatListItemLine]
})
export class ImportReportComponent implements OnChanges {
  @Input({ required: true }) report!: ImportReport;
  /** Campo que identifica o item para o usuário (ex.: `vehicleNumber`). */
  @Input({ required: true }) keyField!: string;
  /** Campo do id no banco (ex.: `vehicleId`), enviado em `confirmIds`. */
  @Input({ required: true }) idField!: string;
  /** Rótulo da chave na tela (ex.: "Prefixo"). */
  @Input() keyLabel = 'Identificador';
  /** Rótulos dos campos de `changes` e `failed.field`; o nome técnico aparece se faltar. */
  @Input() fieldLabels: Record<string, string> = {};
  /** Título da lista de cadastros ausentes (tipos ou cargos). */
  @Input() missingLabel = 'Cadastros ausentes';
  /** Chaves ativas na base que não vieram no arquivo (informativo: nada é desativado). */
  @Input() outside: string[] = [];
  /** Ids das diferenças confirmadas pelo usuário. */
  @Output() confirmChange = new EventEmitter<string[]>();
  /** Colunas da tabela de erros. */
  readonly failedColumns = ['line', 'key', 'field', 'error'];

  pending: ImportItem[] = [];
  ignored: ImportItem[] = [];
  missing: string[] = [];
  private confirmed = new Set<string>();

  ngOnChanges(): void {
    this.pending = this.report.skipped.filter(i => i.changes?.length);
    this.ignored = this.report.skipped.filter(i => !i.changes?.length);
    this.missing = this.report.missingVehicleTypes ?? this.report.missingPositions ?? [];
    this.confirmed.clear();
    this.confirmChange.emit([]);
  }

  key(item: Record<string, unknown>): string {
    return String(item[this.keyField] ?? '');
  }

  id(item: ImportItem): string {
    return String(item[this.idField] ?? '');
  }

  fieldName(field: string): string {
    return this.fieldLabels[field] ?? field;
  }

  /** Texto de uma mudança: "Placa: AAA0A00 → AAA0A01". */
  describe(change: ImportFieldChange): string {
    const show = (v: unknown) => (v === null || v === '' ? '(vazio)' : v === true ? 'Sim' : v === false ? 'Não' : String(v));
    return `${this.fieldName(change.field)}: ${show(change.current)} → ${show(change.new)}`;
  }

  isConfirmed(item: ImportItem): boolean {
    return this.confirmed.has(this.id(item));
  }

  toggle(item: ImportItem, checked: boolean): void {
    if (checked) this.confirmed.add(this.id(item));
    else this.confirmed.delete(this.id(item));
    this.confirmChange.emit([...this.confirmed]);
  }

  toggleAll(checked: boolean): void {
    this.confirmed = new Set(checked ? this.pending.map(i => this.id(i)) : []);
    this.confirmChange.emit([...this.confirmed]);
  }
}
