import { Component, OnInit, ViewChild, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FineCodeInterface } from '../../../core/interfaces/fine-code.interface';
import { MatPaginator } from '@angular/material/paginator';
import { FineCodeService } from '../../../core/services/fine-code.service';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { FineCodeFormComponent } from '../fine-code-form/fine-code-form.component';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-fine-code-page',
  standalone: false,
  templateUrl: './fine-code-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './fine-code-page.component.scss'
})
export class FineCodePageComponent implements OnInit {
  private service = inject(FineCodeService);
  private dialog = inject(MatDialog);
  private notification = inject(NotificationService);


  fineCodeHeader: string[] = [
    'fineNumber',
    'fineDescription',
    'fineKm',
    'fineAlias',
    'fineOrder',
    'actions'
  ];

  fineCodeSource = new MatTableDataSource<FineCodeInterface>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /** Inativos listados (checkbox "Ocultar inativos" desmarcado, T17). */
  includeInactive = false;

  constructor() {
    const auth = inject(AuthService);

    // Coluna de status sempre visível para quem pode ver inativos (T17, regra 3)
    if (auth.canSeeInactive('AUXILIARES')) this.fineCodeHeader.splice(this.fineCodeHeader.length - 1, 0, 'status');
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.getAll(this.includeInactive).subscribe({
      next: (response) => {
        // o backend já filtra os ativos (T17: inativos só com includeInactive)
        this.fineCodeSource.data = response.data ?? [];
        this.fineCodeSource.paginator = this.paginator;
        this.fineCodeSource.sort = this.sort;

        if (this.sort) {
          this.sort.sort({ id: 'fineNumber', start: 'asc', disableClear: false });
        }
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) this.fineCodeSource.data = [];
        else console.error('Erro:', err);
      }
    });
  }

  addFineCode(): void {
    const dialogRef = this.dialog.open(FineCodeFormComponent, {
      width: '1000px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  editFineCode(item: FineCodeInterface) {
    const dialogRef = this.dialog.open(FineCodeFormComponent, {
      width: '1000px',
      disableClose: true,
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  /**
   * Desativa após confirmação pelo `DELETE` (exclusão lógica). Antes era um `PUT` com
   * `activated: false`, que o `juristic` recusa (400): o excluir sempre falhava (achado da T17).
   */
  deleteFineCode(item: FineCodeInterface) {
    if (!item.fineCodeId || !confirm(`Deseja Realmente excluir o código de multa ${item.fineNumber}?`)) return;
    this.service.delete(item.fineCodeId).subscribe({
      next: () => {
        this.notification.info('Código de multa excluído.');
        this.loadData();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status !== 403) this.notification.error(err.error?.message || 'Não foi possível excluir o código de multa.');
      }
    });
  }

  /** Reativa após confirmação (T17); 409 mostra a mensagem da API. */
  reactivateFineCode(item: FineCodeInterface) {
    if (!item.fineCodeId || !confirm(`Deseja reativar o código de multa ${item.fineNumber}?`)) return;
    this.service.reactivate(item.fineCodeId).subscribe({
      next: () => {
        this.notification.info('Código de multa reativado.');
        this.loadData();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status !== 403) this.notification.error(err.error?.message || 'Não foi possível reativar o código de multa.');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.fineCodeSource.filter = filterValue.trim().toLowerCase();

    if (this.fineCodeSource.paginator) {
      this.fineCodeSource.paginator.firstPage();
    }
  }
} 