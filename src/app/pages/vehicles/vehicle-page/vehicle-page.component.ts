import { Component, OnInit, ViewChild } from '@angular/core';

import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { VehicleInterface } from '../../../core/interfaces/vehicle.interface';
import { VehicleService } from '../../../core/services/vehicle.service';
import { VehiclesFormComponent } from '../vehicles-form/vehicles-form.component';
import { VehiclesImportComponent } from '../vehicles-import/vehicles-import.component';

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
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.vehicleService.getAllVehicles().subscribe({
      next: (response: any) => {
        const rawData = response.data || [];
        const mappedData: VehicleInterface[] = rawData.map((item: any) => {
          return {
            vehicleId: item.vehicleId,
            fkVehicleCompanyId: item.fkVehicleCompanyId,
            fkTypeVehicleId: item.fkTypeVehicleId,

            // Dados de exibição
            vehicleNumber: item.vehicleNumber,
            brand: item.brand,
            licensePlate: item.licensePlate,
            chassisNumber: item.chassisNumber,
            fabricationYear: item.fabricationYear,
            modelYear: item.modelYear,
            renavan: item.renavan,
            capacity: item.capacity,
            model: item.model,
            hasWifi: item.hasWifi, 
            cameraType: item.cameraType,
            activated: item.activated,

            // Dados de includes
            typeVehicleName: item.VehicleTypeModel?.typeVehicleName,
            companyName: item.CompanyModel?.companyName,
          };
        });

        const activeData = mappedData.filter(bus => bus.activated !== false);

        this.vehicleDataSource.data = activeData;
        setTimeout(() => {
          this.vehicleDataSource.paginator = this.paginator;
          this.vehicleDataSource.sort = this.sort;
        });
      },
      error: (err) => console.error('Erro ao buscar veículos:', err)
    })
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
