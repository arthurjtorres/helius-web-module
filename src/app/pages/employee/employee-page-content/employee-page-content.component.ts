import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeInterface } from '../../../core/interfaces/employee.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { EmployeePageFormComponent } from '../employee-page-form/employee-page-form.component';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-page-content',
  standalone: false,
  templateUrl: './employee-page-content.component.html',
  styleUrl: './employee-page-content.component.scss'
})
export class EmployeePageContentComponent implements OnInit {

  employeeHeader: string[] = [
    'registration',
    'company',
    'fullName',
    'birthDate',
    'admissionDate',
    'position',
    'actions'
  ]

  employeeDataSource = new MatTableDataSource<EmployeeInterface>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: EmployeeService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.getAll().subscribe({
      next: (response: any) => {
        const rawData = response.data || [];

        const mappedData: EmployeeInterface[] = rawData.map((item: any) => {
          return {
            employeeId: item.employeeId,
            fkEmployeeCompanyId: item.fkEmployeeCompanyId,
            fkEmployeePositionId: item.fkEmployeePositionId,
            fkSectorId: item.fkSectorId,
            fkDepartmentId: item.fkDepartmentId,

            // Dados para a tabela (exibição)
            registration: item.registration,
            admissionDate: item.admissionDate,
            fullName: item.PersonModel?.fullName,
            birthDate: item.PersonModel?.birthDate,
            company: item.CompanyModel?.companyName,
            position: item.PositionModel?.positionName,
            activated: item.activated,
          };
        });

        const activeData = mappedData.filter(emp => emp.activated !== false);

        this.employeeDataSource.data = activeData;
        setTimeout(() => {
          this.employeeDataSource.paginator = this.paginator;
          this.employeeDataSource.sort = this.sort;
        });
      },
      error: (err) => console.error('Erro ao buscar funcionários:', err)
    })
  }

  addEmployee(): void {
    const dialogRef = this.dialog.open(EmployeePageFormComponent, {
      width: '1200px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  editEmployee(item: EmployeeInterface): void {
    const dialogRef = this.dialog.open(EmployeePageFormComponent, {
      width: '1200px',
      disableClose: true,
      data: item
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }
}
