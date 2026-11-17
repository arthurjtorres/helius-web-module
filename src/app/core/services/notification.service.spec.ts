import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    snackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);
    TestBed.configureTestingModule({
      providers: [{ provide: MatSnackBar, useValue: snackBar }],
    });
    service = TestBed.inject(NotificationService);
  });

  it('error abre o snackbar com a classe de erro', () => {
    service.error('Sem permissão');
    expect(snackBar.open).toHaveBeenCalledWith('Sem permissão', 'Fechar', jasmine.objectContaining({ panelClass: 'notification-error', duration: 5000 }));
  });

  it('info abre o snackbar com a classe informativa', () => {
    service.info('Salvo');
    expect(snackBar.open).toHaveBeenCalledWith('Salvo', 'Fechar', jasmine.objectContaining({ panelClass: 'notification-info' }));
  });
});
