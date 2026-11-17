import { SheetData } from '../../../core/utils/sheet-reader';
import { withFileLines } from '../../../shared/import-report/import-report.model';
import { formatDate, parseEmployeeSheet, parseEmployeeWorkbook, txtToSheet } from './employee-sheet';

// Dados fictícios (ZZ_TEST_); o layout imita o .txt do RH e a planilha feita a partir dele.
const TXT = [
  'CHAPAFUNC NOMECOMPLETOFUNC          DTADMFUNC  DESCFUNCAO   DTNASCTOFUNC',
  '-----------------------------------------------------------------------',
  '001234    ZZ_TEST_ MARIA DA SILVA   01/02/2020 MOTORISTA    15/06/1985',
  '001235    ZZ_TEST_ JOAO SOUZA       03/04/2021 COBRADOR(A)  20/07/1990',
  '                        ',
].join('\r\n');

describe('employee-sheet', () => {
  it('.txt de largura fixa: colunas pelo cabeçalho, linhas com o número do arquivo, rodapé vazio ignorado', () => {
    const file = parseEmployeeSheet(txtToSheet(TXT));
    expect(file.error).toBeUndefined();
    expect(file.rows).toEqual([
      { line: 3, registration: '001234', fullName: 'ZZ_TEST_ MARIA DA SILVA', admissionDate: '01/02/2020', position: 'MOTORISTA', birthDate: '15/06/1985', cpf: '' },
      { line: 4, registration: '001235', fullName: 'ZZ_TEST_ JOAO SOUZA', admissionDate: '03/04/2021', position: 'COBRADOR(A)', birthDate: '20/07/1990', cpf: '' },
    ]);
  });

  it('.txt com CPF em qualquer posição e linha curta mantida (o dryRun aponta o campo vazio)', () => {
    const txt = [
      'CHAPAFUNC CPF         NOMECOMPLETOFUNC     DTADMFUNC  DESCFUNCAO DTNASCTOFUNC',
      '-----------------------------------------------------------------------------',
      '000007    52998224725 ZZ_TEST_ ANA LIMA    01/02/2020 MOTORISTA  15/06/1985',
      '000008    ',
    ].join('\n');
    const { rows } = parseEmployeeSheet(txtToSheet(txt));
    expect(rows[0]).toEqual(jasmine.objectContaining({ registration: '000007', cpf: '52998224725', fullName: 'ZZ_TEST_ ANA LIMA' }));
    expect(rows[1]).toEqual(jasmine.objectContaining({ line: 4, registration: '000008', fullName: '', birthDate: '' }));
  });

  it('.txt sem coluna obrigatória: erro com o nome dela', () => {
    const txt = 'CHAPAFUNC NOMECOMPLETOFUNC DTADMFUNC\n------------------------------------\n001 ZZ_TEST_ X 01/01/2020';
    expect(parseEmployeeSheet(txtToSheet(txt)).error).toBe('Colunas não encontradas: DESCFUNCAO, DTNASCTOFUNC.');
  });

  it('.txt sem linha tracejada: cabeçalho não encontrado', () => {
    expect(parseEmployeeSheet(txtToSheet('qualquer coisa')).error).toContain('Cabeçalho não encontrado');
  });

  it('planilha: título antes do cabeçalho, nomes com acento, matrícula numérica e datas do Excel', () => {
    const sheet: SheetData = {
      name: 'Plan1',
      rows: [
        ['ZZ_TEST_ FUNCIONÁRIOS', null],
        ['MATRÍCULA', 'NOME COMPLETO', 'DATA ADMISSÃO', 'FUNÇÃO', 'DATA NASCIMENTO', 'CPF'],
        [1234, 'ZZ_TEST_ MARIA', new Date(2020, 1, 1), 'MOTORISTA', '15/06/1985', '529.982.247-25'],
        [null, null, null, null, null, null],
      ],
    };
    expect(parseEmployeeSheet(sheet).rows).toEqual([
      { line: 3, registration: '1234', fullName: 'ZZ_TEST_ MARIA', admissionDate: '01/02/2020', position: 'MOTORISTA', birthDate: '15/06/1985', cpf: '529.982.247-25' },
    ]);
  });

  it('data do Excel com desvio de minutos do fuso histórico não volta um dia', () => {
    expect(formatDate(new Date(1900, 0, 1, 0, 0, 0))).toBe('01/01/1900');
    expect(formatDate(new Date(1959, 11, 31, 23, 53, 32))).toBe('01/01/1960');
  });

  it('pasta de trabalho: usa a primeira aba que tem o cabeçalho', () => {
    const capa: SheetData = { name: 'Capa', rows: [['ZZ_TEST_']] };
    const dados = txtToSheet(TXT);
    expect(parseEmployeeWorkbook([capa, dados]).rows.length).toBe(2);
    expect(parseEmployeeWorkbook([capa]).error).toContain('Cabeçalho');
  });
});

describe('withFileLines', () => {
  it('troca a posição no envio pela linha do arquivo em todas as listas', () => {
    const fixed = withFileLines({
      dryRun: true, mode: 'upsert', created: [{ line: 1 }], updated: [{ line: 2 }], unchanged: [],
      skipped: [{ line: 2 }], failed: [{ line: 1, field: 'cpf', error: 'x' }, { line: 9, field: 'cpf', error: 'y' }],
    }, [3, 7]);
    expect(fixed.created[0].line).toBe(3);
    expect(fixed.updated![0].line).toBe(7);
    expect(fixed.skipped[0].line).toBe(7);
    expect(fixed.failed.map(f => f.line)).toEqual([3, 9]);
  });
});
