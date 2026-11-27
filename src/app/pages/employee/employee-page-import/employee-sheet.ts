import { Cell, SheetData, cellText, columnIndex, dataRows, findHeader } from '../../../core/utils/sheet-reader';
import { normalizeText } from '../../../core/utils/normalize-text';

/** Funcionário no formato do `/employee/bulk`; `line` é a linha no arquivo, para a pré-visualização. */
export interface EmployeeRow {
  line: number;
  registration: string;
  fullName: string;
  admissionDate: string;
  position: string;
  birthDate: string;
  /** Vazio quando o arquivo não tem a coluna (o backend trata vazio como não informado). */
  cpf: string;
}

/** Arquivo interpretado. `error` quando não dá para importar (sem cabeçalho ou colunas faltando). */
export interface EmployeeFile {
  rows: EmployeeRow[];
  error?: string;
}

type Field = Exclude<keyof EmployeeRow, 'line' | 'cpf'>;

/** Colunas obrigatórias → campo. Apelidos: `.txt` do RH (`CHAPAFUNC`…) e a planilha feita a partir dele. */
const COLUMNS: [Field, string[]][] = [
  ['registration', ['CHAPAFUNC', 'MATRICULA', 'CHAPA']],
  ['fullName', ['NOMECOMPLETOFUNC', 'NOMECOMPLETO', 'NOME COMPLETO', 'NOME']],
  ['admissionDate', ['DTADMFUNC', 'DATAADMISSAO', 'DATA ADMISSAO', 'ADMISSAO']],
  ['position', ['DESCFUNCAO', 'FUNCAO', 'CARGO']],
  ['birthDate', ['DTNASCTOFUNC', 'DATANASCIMENTO', 'DATA NASCIMENTO', 'NASCIMENTO']],
];
const CPF_ALIASES = ['CPF', 'CPFFUNC'];

/**
 * Data no formato do backend (`dd/MM/aaaa`). Célula de data do Excel vira texto; as 12h somadas
 * absorvem o desvio de fuso que o `xlsx` aplica a datas antigas (offset histórico de Brasília), que
 * jogaria a data para o dia anterior. Texto passa como veio (o `dryRun` aponta formato errado).
 */
export const formatDate = (cell: Cell | undefined): string => {
  if (!(cell instanceof Date)) return cellText(cell);
  const d = new Date(cell.getTime() + 12 * 3600 * 1000);
  const two = (n: number) => String(n).padStart(2, '0');
  return `${two(d.getDate())}/${two(d.getMonth() + 1)}/${d.getFullYear()}`;
};

/** Cabeçalho pela coluna da matrícula, aceitando qualquer apelido dela. */
const header = (rows: Cell[][]) => {
  for (const alias of COLUMNS[0][1]) {
    const found = findHeader(rows, [alias]);
    if (found) return found;
  }
  return null;
};

/** Interpreta uma aba (ou o `.txt` já convertido em linhas). Linhas sem matrícula são ignoradas. */
export function parseEmployeeSheet(sheet: SheetData): EmployeeFile {
  const head = header(sheet.rows);
  if (!head) return { rows: [], error: `Cabeçalho não encontrado (coluna ${COLUMNS[0][1].join(' ou ')}).` };

  const index = Object.fromEntries(COLUMNS.map(([field, aliases]) => [field, columnIndex(head.labels, aliases)])) as Record<Field, number>;
  const missing = COLUMNS.filter(([field]) => index[field] < 0).map(([, aliases]) => aliases[0]);
  if (missing.length) return { rows: [], error: `Colunas não encontradas: ${missing.join(', ')}.` };

  const cpf = columnIndex(head.labels, CPF_ALIASES);
  return {
    rows: dataRows(sheet.rows, head, index.registration).map(({ line, cells }) => ({
      line,
      registration: cellText(cells[index.registration]),
      fullName: cellText(cells[index.fullName]),
      admissionDate: formatDate(cells[index.admissionDate]),
      position: cellText(cells[index.position]),
      birthDate: formatDate(cells[index.birthDate]),
      cpf: cpf >= 0 ? cellText(cells[cpf]) : '',
    })),
  };
}

/**
 * `.txt` do RH: ignora o rodapé do export (sem matrícula numérica e sem data). Linha com data é
 * mantida mesmo com matrícula errada, para o `dryRun` apontar: sumindo, o funcionário apareceria
 * em "fora da planilha", onde pode ser desligado.
 */
export function parseEmployeeTxt(text: string): EmployeeFile {
  const file = parseEmployeeSheet(txtToSheet(text));
  const date = /^\d{2}\/\d{2}\/\d{4}$/;
  const isEmployee = (row: EmployeeRow) => /^\d+$/.test(row.registration) || date.test(row.admissionDate) || date.test(row.birthDate);
  return { ...file, rows: file.rows.filter(isEmployee) };
}

/** Planilha de uma única aba (T16); mais de uma aba é recusada. */
export function parseEmployeeWorkbook(sheets: SheetData[]): EmployeeFile {
  if (sheets.length > 1) return { rows: [], error: 'O arquivo deve ter uma única aba.' };
  return sheets.length ? parseEmployeeSheet(sheets[0]) : { rows: [], error: 'Planilha vazia.' };
}

/**
 * No export do RH o rótulo das datas não está alinhado ao dado: havendo uma data começando a até
 * 2 colunas do rótulo, o corte é onde ela começa (os campos podem estar colados, sem espaço).
 */
const cutAt = (line: string, label: number): number => {
  const from = Math.max(label - 2, 0);
  const date = line.substring(from, label + 12).search(/\d{2}\/\d{2}\/\d{4}/);
  return date < 0 ? label : from + date;
};

/**
 * Converte o `.txt` de largura fixa do RH (cabeçalho, linha tracejada, dados) em linhas de células,
 * para usar o mesmo mapeamento da planilha. Cada coluna vai do início do seu rótulo (ou da data perto
 * dele) até o da próxima, sem supor a ordem das colunas. As linhas mantêm o número do arquivo.
 */
export function txtToSheet(text: string): SheetData {
  const lines = text.split(/\r?\n/);
  const sep = lines.findIndex(l => /^-{5,}$/.test(l.trim()));
  if (sep < 1) return { name: 'txt', rows: [] };

  const starts = [...lines[sep - 1].matchAll(/\S+/g)].map(m => m.index ?? 0);
  const cut = (line: string): Cell[] => {
    const at = starts.map(s => cutAt(line, s));
    return at.map((s, i) => line.substring(s, at[i + 1] ?? line.length).trim() || null);
  };
  const labels = starts.map((s, i) => normalizeText(lines[sep - 1].substring(s, starts[i + 1])));
  // A linha tracejada vira linha vazia: o índice de cada linha segue igual ao do arquivo.
  return { name: 'txt', rows: lines.map((line, i) => (i < sep - 1 ? [] : i === sep - 1 ? labels : i === sep ? [] : cut(line))) };
}
