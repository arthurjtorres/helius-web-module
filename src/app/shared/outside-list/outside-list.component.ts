import { Component, EventEmitter, Input, OnChanges, Output, ChangeDetectionStrategy } from '@angular/core';

/** Registro ativo da empresa que não veio no arquivo importado. */
export interface OutsideItem {
  id: string;
  key: string;
}

/**
 * Lista "fora da planilha" depois da importação (T16/T19): marca item a item ou todos e pede a
 * desativação em lote, sempre com confirmação da quantidade. Quem usa chama a rota `bulk-deactivate`.
 */
@Component({
  selector: 'app-outside-list',
  standalone: false,
  templateUrl: './outside-list.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ['.actions { display: flex; justify-content: flex-end; }', '.outside-list { max-height: 20rem; overflow: auto; }'],
})
export class OutsideListComponent implements OnChanges {
  @Input({ required: true }) items: OutsideItem[] = [];
  /** Rótulo da chave (ex.: "Prefixo"). */
  @Input() keyLabel = 'Identificador';
  /** Nome do registro no plural, para a confirmação (ex.: "veículos"). */
  @Input() noun = 'registros';
  @Input() busy = false;
  /** Ids confirmados para desativar. */
  @Output() deactivate = new EventEmitter<string[]>();
  selected = new Set<string>();

  ngOnChanges(): void {
    const ids = new Set(this.items.map(i => i.id));
    this.selected = new Set([...this.selected].filter(id => ids.has(id)));
  }

  get allSelected(): boolean {
    return this.items.length > 0 && this.selected.size === this.items.length;
  }

  toggle(id: string, checked: boolean): void {
    if (checked) this.selected.add(id);
    else this.selected.delete(id);
  }

  toggleAll(checked: boolean): void {
    this.selected = new Set(checked ? this.items.map(i => i.id) : []);
  }

  confirmDeactivate(): void {
    const ids = [...this.selected];
    if (!ids.length || !confirm(`Desativar ${ids.length} ${this.noun}? Eles deixam de aparecer nas listagens.`)) return;
    this.deactivate.emit(ids);
  }
}
