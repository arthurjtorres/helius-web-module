import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ImportReportComponent } from './import-report.component';
import { ImportReportModule } from './import-report.module';
import { ImportReport } from './import-report.model';

describe('ImportReportComponent', () => {
  let fixture: ComponentFixture<ImportReportComponent>;
  let component: ImportReportComponent;
  let emitted: string[][];

  const report: ImportReport = {
    dryRun: true,
    mode: 'upsert',
    created: [{ line: 5, vehicleNumber: 'ZZ_TEST_101', vehicleId: 'n1' }],
    updated: [],
    unchanged: [{ line: 6, vehicleNumber: 'ZZ_TEST_102', vehicleId: 'v2' }],
    skipped: [
      { line: 7, vehicleNumber: 'ZZ_TEST_103', vehicleId: 'v3', reason: 'Alteração não confirmada.', changes: [{ field: 'licensePlate', current: 'AAA0A00', new: 'AAA0A01' }] },
      { line: 8, vehicleNumber: 'ZZ_TEST_104', vehicleId: 'v4', reason: 'Veículo já cadastrado.' },
    ],
    failed: [{ line: 9, vehicleNumber: 'ZZ_TEST_105', field: 'renavan', error: 'Renavam inválido.' }],
    missingVehicleTypes: ['ZZ_TEST_TIPO'],
  };

  function render(r: ImportReport, outside: string[] = []) {
    component.report = r;
    component.outside = outside;
    component.ngOnChanges();
    fixture.detectChanges();
    return (fixture.nativeElement as HTMLElement).textContent ?? '';
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ImportReportModule, NoopAnimationsModule] }).compileComponents();
    fixture = TestBed.createComponent(ImportReportComponent);
    component = fixture.componentInstance;
    component.keyField = 'vehicleNumber';
    component.idField = 'vehicleId';
    component.keyLabel = 'Prefixo';
    component.fieldLabels = { licensePlate: 'Placa', renavan: 'Renavam' };
    emitted = [];
    component.confirmChange.subscribe(ids => emitted.push(ids));
  });

  it('mostra contagens, erro por linha, ausentes e fora da planilha', () => {
    const text = render(report, ['ZZ_TEST_999']);
    expect(text).toContain('1 a criar');
    expect(text).toContain('1 sem mudança');
    expect(text).toContain('2 ignorados');
    expect(text).toContain('Renavam inválido.');
    expect(text).toContain('ZZ_TEST_TIPO');
    expect(text).toContain('ZZ_TEST_999');
  });

  it('separa diferenças a confirmar dos ignorados e descreve a mudança com rótulo', () => {
    const text = render(report);
    expect(component.pending.map(i => i['vehicleId'])).toEqual(['v3']);
    expect(component.ignored.map(i => i['vehicleId'])).toEqual(['v4']);
    expect(text).toContain('Placa: AAA0A00 → AAA0A01');
  });

  it('emite os ids confirmados e zera ao receber novo relatório', () => {
    render(report);
    component.toggle(component.pending[0], true);
    expect(emitted.at(-1)).toEqual(['v3']);
    component.toggle(component.pending[0], false);
    expect(emitted.at(-1)).toEqual([]);
    component.toggleAll(true);
    expect(emitted.at(-1)).toEqual(['v3']);
    render({ ...report, skipped: [] });
    expect(emitted.at(-1)).toEqual([]);
  });

  it('usa missingPositions quando o relatório é de funcionários', () => {
    render({ ...report, missingVehicleTypes: undefined, missingPositions: ['ZZ_TEST_CARGO'] });
    expect(component.missing).toEqual(['ZZ_TEST_CARGO']);
  });
});
