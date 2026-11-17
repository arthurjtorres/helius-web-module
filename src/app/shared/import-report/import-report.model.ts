/**
 * Relatório de importação em lote, como `operations` (`/vehicle/bulk`) e `registry` (`/employee/bulk`)
 * devolvem. Os itens variam só no nome da chave (`vehicleNumber`/`registration`) e do id
 * (`vehicleId`/`employeeId`), por isso ficam como registro aberto.
 */
export interface ImportFieldChange {
  field: string;
  current: string | number | boolean | null;
  new: string | number | boolean;
}

/** Item criado, atualizado, sem mudança ou ignorado. */
export interface ImportItem {
  line: number;
  reason?: string;
  changes?: ImportFieldChange[];
  [key: string]: unknown;
}

/** Falha de um item (linha e campo). */
export interface ImportFailure {
  line: number;
  field: string;
  error: string;
  code?: 'INVALID' | 'CONFLICT';
  [key: string]: unknown;
}

export interface ImportReport {
  dryRun: boolean;
  mode: 'insert' | 'upsert';
  created: ImportItem[];
  updated?: ImportItem[];
  unchanged?: ImportItem[];
  skipped: ImportItem[];
  failed: ImportFailure[];
  missingVehicleTypes?: string[];
  missingPositions?: string[];
}

/**
 * O backend numera os itens pela posição na lista enviada (1 = primeiro); a tela mostra a linha do
 * arquivo. Troca uma pela outra em todas as listas do relatório.
 * @param lines linha do arquivo de cada item, na ordem do envio.
 */
export function withFileLines(report: ImportReport, lines: number[]): ImportReport {
  const fix = <T extends { line: number }>(items: T[]): T[] => items.map(i => ({ ...i, line: lines[i.line - 1] ?? i.line }));
  return {
    ...report,
    created: fix(report.created),
    updated: report.updated && fix(report.updated),
    unchanged: report.unchanged && fix(report.unchanged),
    skipped: fix(report.skipped),
    failed: fix(report.failed),
  };
}
