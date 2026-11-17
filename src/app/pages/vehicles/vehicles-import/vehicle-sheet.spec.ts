import { Cell } from '../../../core/utils/sheet-reader';
import { parseCapacity, parseVehicleSheet } from './vehicle-sheet';

// Dados fictícios no layout da planilha de frota (nunca a planilha real)
const sheetA: Cell[][] = [
  ['ZZ_TEST FROTA A'],
  ['EMPRESA', 'PREFIXO', 'MARCA', 'MODELO', 'PLACA', 'CHASSI', 'ANO', null, 'RENAVAN', 'MODELO', 'CAP. PASSAG.', null],
  [null, null, null, null, null, null, 'FAB.', 'MOD.', null, null, null, null],
  ['ZZ_TEST_EMPRESA', 101, 'MARCA', ' O-500 ', 'AAA0A00', '9BWZZZ377VT004251', 2020, 2021, 123456789, 'D-CONVENCIONAL AR', 44, '#VALUE!'],
  ['ZZ_TEST_EMPRESA', 102, 'MARCA', '0 500', 'AAA0A01', '9BWZZZ377VT004252', 2019, 2019, '01234567890', 'VAN', '-', null],
];

const sheetB: Cell[][] = [
  ['EMPRESA', 'PREFIXO', 'CRLV 2025', 'MARCA', 'MODELO', 'PLACA', 'CHASSI', 'ANO', null, 'RENAVAN', 'TP DE FROTA', 'CAP. PASSAG.'],
  [null, null, null, null, null, null, null, 'FAB.', 'MOD.', null, null, null],
  ['ZZ_TEST_OUTRA', 201, 'OK', 'MARCA', 'MODELO B', 'BBB1234', 'CHASSI0000000001', 2022, 2022, '11111111111', 'D-MICRO', 30],
];

describe('parseVehicleSheet', () => {
  it('mapeia a aba com tipo na 2ª coluna MODELO', () => {
    const sheet = parseVehicleSheet({ name: 'A', rows: sheetA });
    expect(sheet.error).toBeUndefined();
    expect(sheet.companyName).toBe('ZZ_TEST_EMPRESA');
    expect(sheet.rows[0]).toEqual({
      line: 4, vehicleNumber: '101', brand: 'MARCA', model: 'O-500', licensePlate: 'AAA0A00',
      chassisNumber: '9BWZZZ377VT004251', fabricationYear: '2020', modelYear: '2021', renavan: '123456789',
      typeVehicleName: 'D-CONVENCIONAL AR', capacity: 44, hasWifi: null, cameraType: null,
    });
  });

  it('capacidade "-" vira null (usuário preenche) e o modelo não é normalizado', () => {
    const [, van] = parseVehicleSheet({ name: 'A', rows: sheetA }).rows;
    expect(van.capacity).toBeNull();
    expect(van.model).toBe('0 500');
    expect(van.renavan).toBe('01234567890');
  });

  it('mapeia a aba com TP DE FROTA e coluna extra', () => {
    const [row] = parseVehicleSheet({ name: 'B', rows: sheetB }).rows;
    expect(row.model).toBe('MODELO B');
    expect(row.typeVehicleName).toBe('D-MICRO');
    expect(row.capacity).toBe(30);
  });

  it('aba sem cabeçalho ou sem colunas obrigatórias traz erro', () => {
    expect(parseVehicleSheet({ name: 'X', rows: [['nada']] }).error).toContain('Cabeçalho');
    expect(parseVehicleSheet({ name: 'Y', rows: [['PREFIXO', 'PLACA'], [1, 'AAA0A00']] }).error).toContain('Colunas não encontradas');
  });

  it('parseCapacity aceita só inteiros de 1 a 300', () => {
    expect([44, '30', 0, 301, '-', null, 4.5].map(parseCapacity)).toEqual([44, 30, null, null, null, null, null]);
  });
});
