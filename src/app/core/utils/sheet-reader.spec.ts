import * as XLSX from 'xlsx';
import { Cell, cellText, columnIndex, dataRows, findHeader, readWorkbook } from './sheet-reader';

/** Monta um .xlsx em memória (dados fictícios que imitam o layout da planilha de frota). */
function workbook(sheets: Record<string, Cell[][]>): ArrayBuffer {
  const wb = XLSX.utils.book_new();
  Object.entries(sheets).forEach(([name, rows]) => XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), name));
  return XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
}

// Aba 1: tipo na 2ª coluna MODELO; cabeçalho em duas linhas (ANO / FAB. e MOD.)
const sheetA: Cell[][] = [
  ['ZZ_TEST FROTA A'],
  ['CNPJ: 00.000.000/0000-00'],
  ['EMPRESA', 'PREFIXO', 'MARCA', 'MODELO', 'PLACA', 'CHASSI', 'ANO', null, 'RENAVAN', 'MODELO', 'CAP. PASSAG.', null],
  [null, null, null, null, null, null, 'FAB.', 'MOD.', null, null, null, null],
  ['ZZ_TEST_EMPRESA', 101, 'MARCA', 'O-500', 'AAA0A00', '9BWZZZ377VT004251', 2020, 2021, 123456789, 'D-CONVENCIONAL AR', 44, '#VALUE!'],
  [null, null, null, null, null, null, null, null, null, null, null, null],
  ['ZZ_TEST_EMPRESA', 102, 'MARCA', '0 500', 'AAA0A01', '9BWZZZ377VT004252', 2019, 2019, '01234567890', 'VAN', '-', null],
];

// Aba 2: tipo em "TP DE FROTA", coluna extra CRLV, cabeçalho logo após uma linha de título
const sheetB: Cell[][] = [
  ['ZZ_TEST FROTA B'],
  ['EMPRESA', 'PREFIXO', 'CRLV 2025', 'MARCA', 'MODELO', 'PLACA', 'ANO', null, 'TP DE FROTA'],
  [null, null, null, null, null, null, 'FAB.', 'MOD.', null],
  ['ZZ_TEST_OUTRA', 201, 'OK', 'MARCA', 'MODELO', 'BBB1234', 2022, 2022, 'D-MICRO'],
];

describe('sheet-reader', () => {
  const sheets = readWorkbook(workbook({ A: sheetA, B: sheetB, Vazia: [['sem cabeçalho']] }));
  const [a, b, empty] = sheets;
  const subs = ['FAB.', 'MOD.'];

  it('lê todas as abas', () => {
    expect(sheets.map(s => s.name)).toEqual(['A', 'B', 'Vazia']);
  });

  it('acha o cabeçalho depois dos títulos e junta as duas linhas', () => {
    const header = findHeader(a.rows, ['PREFIXO', 'PLACA'], subs)!;
    expect(header.dataStart).toBe(4);
    expect(header.labels.slice(6, 8)).toEqual(['FAB.', 'MOD.']);
    expect(header.labels[1]).toBe('PREFIXO');
  });

  it('cabeçalho de uma linha só quando a seguinte não tem sub-rótulo', () => {
    const header = findHeader([['PREFIXO', 'PLACA'], [1, 'AAA0A00']], ['PREFIXO', 'PLACA'], subs)!;
    expect(header.dataStart).toBe(1);
  });

  it('aba sem cabeçalho devolve null', () => {
    expect(findHeader(empty.rows, ['PREFIXO', 'PLACA'], subs)).toBeNull();
  });

  it('distingue a 1ª e a 2ª coluna MODELO e acha TP DE FROTA na outra aba', () => {
    const ha = findHeader(a.rows, ['PREFIXO', 'PLACA'], subs)!;
    expect(columnIndex(ha.labels, ['MODELO'], 1)).toBe(3);
    expect(columnIndex(ha.labels, ['MODELO'], 2)).toBe(9);
    expect(columnIndex(ha.labels, ['TP DE FROTA'])).toBe(-1);

    const hb = findHeader(b.rows, ['PREFIXO', 'PLACA'], subs)!;
    expect(columnIndex(hb.labels, ['TP DE FROTA'])).toBe(8);
    expect(columnIndex(hb.labels, ['MODELO'], 2)).toBe(-1);
  });

  it('pula linhas sem chave e informa a linha do Excel', () => {
    const header = findHeader(a.rows, ['PREFIXO', 'PLACA'], subs)!;
    const rows = dataRows(a.rows, header, 1);
    expect(rows.map(r => r.line)).toEqual([5, 7]);
  });

  it('cellText: inteiro sem notação científica, texto aparado, vazio para nulo', () => {
    expect(cellText(123456789)).toBe('123456789');
    expect(cellText(12345678901)).toBe('12345678901');
    expect(cellText('  O-500 ')).toBe('O-500');
    expect(cellText(null)).toBe('');
  });
});
