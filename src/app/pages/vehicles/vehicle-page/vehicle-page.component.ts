import { Component, OnInit, ViewChild } from '@angular/core';

import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { VehicleInterface } from '../../../core/interfaces/vehicle.interface';
import { VehicleService } from '../../../core/services/vehicle.service';
import { VehiclesFormComponent } from '../vehicles-form/vehicles-form.component';
import { VehiclesImportComponent } from '../vehicles-import/vehicles-import.component';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-vehicle-page',
  standalone: false,
  templateUrl: './vehicle-page.component.html',
  styleUrl: './vehicle-page.component.scss'
})
export class VehiclePageComponent implements OnInit {

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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private vehicleService: VehicleService,
    private dialog: MatDialog,
    private notification: NotificationService,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  /** Carrega os veículos ativos. 404 = nenhum veículo; 403 já é avisado pelo interceptor. */
  loadData() {
    this.vehicleService.getAllVehicles().subscribe({
      next: (response) => this.showVehicles(response.data ?? []),
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) return this.showVehicles([]);
        if (err.status !== 403) this.notification.error('Não foi possível carregar os veículos.');
      }
    })
  }

  private showVehicles(vehicles: VehicleInterface[]): void {
    this.vehicleDataSource.data = vehicles;
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
    const dialogRef = this.dialog.open(VehiclesFormComponent, {
      width: '1200px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }


}
