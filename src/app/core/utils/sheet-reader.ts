import * as XLSX from 'xlsx';
import { normalizeText } from './normalize-text';

/** Valor de uma célula como o `xlsx` entrega (`cellDates` liga `Date`). */
export type Cell = string | number | boolean | Date | null;

/** Aba lida como matriz de células, na ordem da planilha. */
export interface SheetData {
  name: string;
  rows: Cell[][];
}

/** Cabeçalho localizado: rótulos normalizados por coluna e a primeira linha de dados (índice 0). */
export interface HeaderInfo {
  labels: string[];
  dataStart: number;
}

/** Linha de dados com o número da linha no Excel (1 = primeira), para mensagens ao usuário. */
export interface DataRow {
  line: number;
  cells: Cell[];
}

/**
 * Lê todas as abas de um arquivo de planilha.
 * @param data conteúdo do arquivo (`File.arrayBuffer()`).
 */
export function readWorkbook(data: ArrayBuffer): SheetData[] {
  const workbook = XLSX.read(data, { type: 'array', cellDates: true });
  return workbook.SheetNames.map(name => ({
    name,
    rows: XLSX.utils.sheet_to_json<Cell[]>(workbook.Sheets[name], { header: 1, raw: true, defval: null, blankrows: true }),
  }));
}

/** Texto aparado da célula; números viram texto sem notação científica nem casas decimais inteiras. */
export function cellText(cell: Cell | undefined): string {
  if (cell === null || cell === undefined) return '';
  if (typeof cell === 'number') return Number.isInteger(cell) ? cell.toFixed(0) : String(cell);
  return String(cell).trim();
}

const label = (cell: Cell | undefined): string => normalizeText(cellText(cell));

/**
 * Localiza o cabeçalho: a primeira linha (até `maxScan`) que tem todos os rótulos obrigatórios, depois
 * das linhas de título da aba. Se a linha seguinte tiver algum rótulo de `subLabels` (ex.: `FAB.`, `MOD.`
 * debaixo de `ANO`), o cabeçalho ocupa as duas linhas: cada coluna fica com o rótulo de baixo, se houver,
 * senão com o de cima.
 * @param rows linhas da aba.
 * @param required rótulos que identificam o cabeçalho (comparados sem acento nem caixa).
 * @param subLabels rótulos possíveis da segunda linha do cabeçalho.
 * @returns o cabeçalho, ou `null` se a aba não tiver um.
 */
export function findHeader(rows: Cell[][], required: string[], subLabels: string[] = [], maxScan = 20): HeaderInfo | null {
  const need = required.map(normalizeText);
  const subs = new Set(subLabels.map(normalizeText));
  for (let i = 0; i < Math.min(rows.length, maxScan); i++) {
    const top = rows[i].map(label);
    if (!need.every(r => top.includes(r))) continue;

    const below = (rows[i + 1] ?? []).map(label);
    if (!below.some(l => subs.has(l))) return { labels: top, dataStart: i + 1 };

    const width = Math.max(top.length, below.length);
    const labels = Array.from({ length: width }, (_, c) => (subs.has(below[c] ?? '') ? below[c] : top[c] ?? ''));
    return { labels, dataStart: i + 2 };
  }
  return null;
}

/**
 * Índice da coluna cujo rótulo é um dos apelidos, na ocorrência pedida (a planilha de frota repete
 * `MODELO`: a 1ª é o modelo do chassi, a 2ª o tipo).
 * @returns o índice, ou -1 se não existir.
 */
export function columnIndex(labels: string[], aliases: string[], occurrence = 1): number {
  const wanted = new Set(aliases.map(normalizeText));
  let seen = 0;
  for (let i = 0; i < labels.length; i++) {
    if (wanted.has(labels[i]) && ++seen === occurrence) return i;
  }
  return -1;
}

/**
 * Linhas de dados: do fim do cabeçalho em diante, só as que têm valor na coluna-chave (pula linhas
 * vazias, de total e as colunas auxiliares não atrapalham).
 * @param keyColumn índice da coluna que identifica o registro (ex.: `PREFIXO`).
 */
export function dataRows(rows: Cell[][], header: HeaderInfo, keyColumn: number): DataRow[] {
  return rows
    .slice(header.dataStart)
    .map((cells, i) => ({ line: header.dataStart + i + 1, cells }))
    .filter(row => cellText(row.cells[keyColumn]) !== '');
}
