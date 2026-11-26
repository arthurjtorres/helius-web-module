import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';

import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { VehicleInterface } from '../../../core/interfaces/vehicle.interface';
import { VehicleService } from '../../../core/services/vehicle.service';
import { VehiclesFormComponent } from '../vehicles-form/vehicles-form.component';
import { VehiclesImportComponent } from '../vehicles-import/vehicles-import.component';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CompanySelectComponent } from '../../../shared/company-select/company-select.component';
import { FormsModule } from '@angular/forms';
import { InactiveToggleComponent } from '../../../shared/inactive-toggle/inactive-toggle.component';
import { MatFormField, MatInput, MatSuffix } from '@angular/material/input';
import { MatDivider } from '@angular/material/list';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
    selector: 'app-vehicle-page',
    templateUrl: './vehicle-page.component.html',
    styleUrl: './vehicle-page.component.scss',
    imports: [MatFabButton, MatIcon, CompanySelectComponent, FormsModule, InactiveToggleComponent, MatFormField, MatInput, MatIconButton, MatSuffix, MatDivider, MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatTooltip, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator]
})
export class VehiclePageComponent implements OnInit {
  private vehicleService = inject(VehicleService);
  private dialog = inject(MatDialog);
  private notification = inject(NotificationService);


  vehicleHeader: string[] = [
    'company',
    'vehicleNumber',
    'type',
    'brand',
    'licensePlate',
    'renavan',
    'model',
    'actions'
  ]

  vehicleDataSource = new MatTableDataSource<VehicleInterface>([]);

  /** Signal: a mensagem de lista vazia fica fora da tabela (OnPush). */
  readonly hasRows = signal(false);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /** Empresa escolhida no combobox; a tabela fica vazia até a escolha. */
  companyId = '';

  /** Inativos listados (checkbox "Ocultar inativos" desmarcado, T17). */
  includeInactive = false;

  constructor() {
    const auth = inject(AuthService);

    // Coluna de status sempre visível para quem pode ver inativos (T17, regra 3)
    if (auth.canSeeInactive('VEICULOS')) this.vehicleHeader.splice(this.vehicleHeader.length - 1, 0, 'status');
  }

  ngOnInit(): void {
    this.loadData();
  }

  /** Veículos da empresa escolhida (só ativos, exceto com `includeInactive`); vazio até escolher (T19). 404 = nenhum; 403 já é avisado pelo interceptor. */
  loadData() {
    if (!this.companyId) return this.showVehicles([]);
    this.vehicleService.getVehiclesByCompany(this.companyId, this.includeInactive).subscribe({
      next: (response) => this.showVehicles(response.data ?? []),
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) return this.showVehicles([]);
        if (err.status !== 403) this.notification.error('Não foi possível carregar os veículos.');
      }
    })
  }

  private showVehicles(vehicles: VehicleInterface[]): void {
    this.vehicleDataSource.data = vehicles;
    this.hasRows.set(vehicles.length > 0);
    setTimeout(() => {
      this.vehicleDataSource.paginator = this.paginator;
      this.vehicleDataSource.sort = this.sort;
    });
  }

  importVehicles(): void {
    const dialogRef = this.dialog.open(VehiclesImportComponent, {
      width: '1200px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  addVehicle(): void {
    this.openForm(null);
  }

  editVehicle(vehicle: VehicleInterface): void {
    this.openForm(vehicle);
  }

  /** Desativa o veículo (exclusão lógica), após confirmação. */
  deleteVehicle(vehicle: VehicleInterface): void {
    if (!vehicle.vehicleId || !confirm(`Deseja realmente desativar o veículo ${vehicle.vehicleNumber}?`)) return;
    this.vehicleService.deleteVehicle(vehicle.vehicleId).subscribe({
      next: () => {
        this.notification.info('Veículo desativado.');
        this.loadData();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status !== 403) this.notification.error(err.error?.message || 'Não foi possível desativar o veículo.');
      }
    });
  }

  /** Reativa o veículo (T17); 409 (tipo de veículo inativo, unicidade) mostra a mensagem da API. */
  reactivateVehicle(vehicle: VehicleInterface): void {
    if (!vehicle.vehicleId || !confirm(`Deseja reativar o veículo ${vehicle.vehicleNumber}?`)) return;
    this.vehicleService.reactivateVehicle(vehicle.vehicleId).subscribe({
      next: () => {
        this.notification.info('Veículo reativado.');
        this.loadData();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status !== 403) this.notification.error(err.error?.message || 'Não foi possível reativar o veículo.');
      }
    });
  }

  private openForm(vehicle: VehicleInterface | null): void {
    const dialogRef = this.dialog.open(VehiclesFormComponent, {
      width: '1200px',
      disableClose: true,
      data: vehicle,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }
}
