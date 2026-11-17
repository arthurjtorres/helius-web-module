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
