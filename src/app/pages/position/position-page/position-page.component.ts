import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import PositionInterface from '../../../core/interfaces/position.interface';
import { PositionService } from '../../../core/services/position.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { PositionFormComponent, PositionFormData } from '../position-form/position-form.component';

/** SRH › Cargos: lista, cria, edita e desativa cargos (`registry`). */
@Component({
  selector: 'app-position-page',
  standalone: false,
  templateUrl: './position-page.component.html',
  styleUrl: '../../vehicles/vehicle-page/vehicle-page.component.scss'
})
export class PositionPageComponent implements OnInit {
  readonly columns = ['positionCode', 'positionName', 'actions'];
  dataSource = new MatTableDataSource<PositionInterface>([]);

  constructor(
    private service: PositionService,
    private dialog: MatDialog,
    private notification: NotificationService,
    auth: AuthService,
  ) {
    // Coluna de status sempre visível para quem pode ver inativos (T17, regra 3)
    if (auth.canSeeInactive('ORGANOGRAMA')) this.columns.splice(this.columns.length - 1, 0, 'status');
  }

  /** Inativos listados (checkbox "Ocultar inativos" desmarcado, T17). */
  includeInactive = false;

  ngOnInit(): void {
    this.loadData();
  }

  /** Carrega os cargos ativos. 404 = nenhum cargo; 403 já é avisado pelo interceptor. */
  loadData(): void {
    this.service.getAll(this.includeInactive).subscribe({
      next: (response) => this.dataSource.data = response.data ?? [],
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) this.dataSource.data = [];
        else if (err.status !== 403) this.notification.error('Não foi possível carregar os cargos.');
      }
    });
  }

  openForm(position?: PositionInterface): void {
    const data: PositionFormData = { position, existing: this.dataSource.data.filter(i => i.activated !== false) };
    this.dialog.open(PositionFormComponent, { width: '700px', disableClose: true, data })
      .afterClosed().subscribe(saved => { if (saved) this.loadData(); });
  }

  /** Reativa após confirmação (T17); 409 mostra a mensagem da API. */
  reactivatePosition(item: PositionInterface): void {
    if (!item.positionId || !confirm(`Deseja reativar o cargo ${item.positionName}?`)) return;
    this.service.reactivate(item.positionId).subscribe({
      next: () => {
        this.notification.info('Cargo reativado.');
        this.loadData();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status !== 403) this.notification.error(err.error?.message || 'Não foi possível reativar o cargo.');
      }
    });
  }

  /** Desativa após confirmação. O backend recusa (409) se houver funcionários ativos no cargo. */
  deletePosition(position: PositionInterface): void {
    if (!position.positionId || !confirm(`Deseja realmente excluir o cargo ${position.positionName}?`)) return;
    this.service.delete(position.positionId).subscribe({
      next: () => {
        this.notification.info('Cargo excluído.');
        this.loadData();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status !== 403) this.notification.error(err.error?.message || 'Não foi possível excluir o cargo.');
      }
    });
  }
}
