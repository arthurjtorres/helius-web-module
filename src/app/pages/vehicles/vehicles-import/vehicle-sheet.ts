import { Cell, SheetData, cellText, columnIndex, dataRows, findHeader } from '../../../core/utils/sheet-reader';

/** Linha da planilha de frota já no formato do `/vehicle/bulk` (Wi-Fi e câmera `null` = padrão da aba). */
export interface VehicleRow {
  line: number;
  vehicleNumber: string;
  brand: string;
  model: string;
  licensePlate: string;
  chassisNumber: string;
  fabricationYear: string;
  modelYear: string;
  renavan: string;
  typeVehicleName: string;
  /** `null` quando a célula não é um inteiro de 1 a 300 (ex.: `-` nas vans): o usuário preenche. */
  capacity: number | null;
  hasWifi: boolean | null;
  cameraType: string | null;
}

/** Aba interpretada. `error` quando não dá para importar (sem cabeçalho ou colunas faltando). */
export interface VehicleSheet {
  name: string;
  rows: VehicleRow[];
  /** Primeiro valor da coluna `EMPRESA`, para pré-selecionar a empresa. */
  companyName: string;
  error?: string;
}

/** Colunas da planilha → campo, com apelidos e ocorrência (a 1ª `MODELO` é o modelo do chassi). */
const COLUMNS: [keyof VehicleRow, string[], number][] = [
  ['vehicleNumber', ['PREFIXO'], 1],
  ['brand', ['MARCA'], 1],
  ['model', ['MODELO'], 1],
  ['licensePlate', ['PLACA'], 1],
  ['chassisNumber', ['CHASSI'], 1],
  ['fabricationYear', ['FAB.', 'ANO FAB.'], 1],
  ['modelYear', ['MOD.', 'ANO MOD.'], 1],
  ['renavan', ['RENAVAN', 'RENAVAM'], 1],
  ['capacity', ['CAP. PASSAG.', 'CAPACIDADE'], 1],
];

/** Capacidade aceita pelo backend: inteiro de 1 a 300. */
export const parseCapacity = (cell: Cell | undefined): number | null => {
  const text = cellText(cell);
  return /^\d+$/.test(text) && +text >= 1 && +text <= 300 ? +text : null;
};

/**
 * Interpreta uma aba da planilha de frota. As abas variam: o tipo fica em `TP DE FROTA` ou na
 * 2ª coluna `MODELO`; colunas extras (CRLV, gravame, comodato) são ignoradas.
 */
export function parseVehicleSheet(sheet: SheetData): VehicleSheet {
  const empty = { name: sheet.name, rows: [], companyName: '' };
  const header = findHeader(sheet.rows, ['PREFIXO', 'PLACA'], ['FAB.', 'MOD.']);
  if (!header) return { ...empty, error: 'Cabeçalho não encontrado (colunas PREFIXO e PLACA).' };

  const index = Object.fromEntries(COLUMNS.map(([field, aliases, occ]) => [field, columnIndex(header.labels, aliases, occ)]));
  const typeTp = columnIndex(header.labels, ['TP DE FROTA', 'TIPO']);
  index['typeVehicleName'] = typeTp >= 0 ? typeTp : columnIndex(header.labels, ['MODELO'], 2);
  const missing = Object.entries(index).filter(([, i]) => i < 0).map(([field]) => field);
  if (missing.length) return { ...empty, error: `Colunas não encontradas: ${missing.join(', ')}.` };

  const companyColumn = columnIndex(header.labels, ['EMPRESA']);
  const rows = dataRows(sheet.rows, header, index['vehicleNumber']);
  const text = (cells: Cell[], field: string) => cellText(cells[index[field]]);
  return {
    name: sheet.name,
    companyName: rows.map(r => cellText(r.cells[companyColumn])).find(Boolean) ?? '',
    rows: rows.map(({ line, cells }) => ({
      line,
      vehicleNumber: text(cells, 'vehicleNumber'),
      brand: text(cells, 'brand'),
      model: text(cells, 'model'),
      licensePlate: text(cells, 'licensePlate'),
      chassisNumber: text(cells, 'chassisNumber'),
      fabricationYear: text(cells, 'fabricationYear'),
      modelYear: text(cells, 'modelYear'),
      renavan: text(cells, 'renavan'),
      typeVehicleName: text(cells, 'typeVehicleName'),
      capacity: parseCapacity(cells[index['capacity']]),
      hasWifi: null,
      cameraType: null,
    })),
  };
}
