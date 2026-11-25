import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { VehicleTypeInterface } from '../../../core/interfaces/vehicle.interface';
import { VehicleTypeService } from '../../../core/services/vehicle-type.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { VehicleTypeFormComponent, VehicleTypeFormData } from '../vehicle-type-form/vehicle-type-form.component';

/** Aba "Tipo de Veículo": lista, cria, edita e desativa tipos (`operations`). */
@Component({
  selector: 'app-vehicle-type-page',
  standalone: false,
  templateUrl: './vehicle-type-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: '../vehicle-page/vehicle-page.component.scss'
})
export class VehicleTypePageComponent implements OnInit {
  private service = inject(VehicleTypeService);
  private dialog = inject(MatDialog);
  private notification = inject(NotificationService);

  readonly columns = ['typeVehicleName', 'airConditioner', 'actions'];
  dataSource = new MatTableDataSource<VehicleTypeInterface>([]);

  constructor() {
    const auth = inject(AuthService);

    // Coluna de status sempre visível para quem pode ver inativos (T17, regra 3)
    if (auth.canSeeInactive('VEICULOS')) this.columns.splice(this.columns.length - 1, 0, 'status');
  }

  /** Inativos listados (checkbox "Ocultar inativos" desmarcado, T17). */
  includeInactive = false;

  ngOnInit(): void {
    this.loadData();
  }

  /** Carrega os tipos ativos. 404 = nenhum tipo; 403 já é avisado pelo interceptor. */
  loadData(): void {
    this.service.list(this.includeInactive).subscribe({
      next: (response) => this.dataSource.data = response.data ?? [],
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) this.dataSource.data = [];
        else if (err.status !== 403) this.notification.error('Não foi possível carregar os tipos de veículo.');
      }
    });
  }

  openForm(type?: VehicleTypeInterface): void {
    const data: VehicleTypeFormData = { type, existing: this.dataSource.data.filter(i => i.activated !== false) };
    this.dialog.open(VehicleTypeFormComponent, { width: '700px', disableClose: true, data })
      .afterClosed().subscribe(saved => { if (saved) this.loadData(); });
  }

  /** Reativa após confirmação (T17); 409 mostra a mensagem da API. */
  reactivateType(item: VehicleTypeInterface): void {
    if (!item.typeVehicleId || !confirm(`Deseja reativar o tipo de veículo ${item.typeVehicleName}?`)) return;
    this.service.reactivate(item.typeVehicleId).subscribe({
      next: () => {
        this.notification.info('Tipo de veículo reativado.');
        this.loadData();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status !== 403) this.notification.error(err.error?.message || 'Não foi possível reativar o tipo de veículo.');
      }
    });
  }

  /** Desativa após confirmação. O backend recusa (409) se houver veículos ativos do tipo. */
  deleteType(type: VehicleTypeInterface): void {
    if (!type.typeVehicleId || !confirm(`Deseja realmente desativar o tipo ${type.typeVehicleName}?`)) return;
    this.service.delete(type.typeVehicleId).subscribe({
      next: () => {
        this.notification.info('Tipo de veículo desativado.');
        this.loadData();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status !== 403) this.notification.error(err.error?.message || 'Não foi possível desativar o tipo de veículo.');
      }
    });
  }
}
