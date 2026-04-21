import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeDTO, EmployeeView } from '../../../core/interfaces/employee.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { EmployeePageFormComponent } from '../employee-page-form/employee-page-form.component';
import { EmployeeService } from '../../../core/services/employee.service';
import { EmployeePageImportComponent } from '../employee-page-import/employee-page-import.component';

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

  employeeDataSource = new MatTableDataSource<EmployeeView>([]);

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

        const mappedData: EmployeeView[] = rawData.map((item: any) => {
          return {
            employeeId: item.employeeId,
            fkPersonId: item.fkPersonId,
            fkCompanyId: item.fkCompanyId,
            fkPositionId: item.fkPositionId,
            fkSectorId: item.fkSectorId,
            fkDepartmentId: item.fkDepartmentId,

            // Dados para a tabela (exibição)
            registration: item.registration,
            admissionDate: item.admissionDate,
            fullName: item.Person?.fullName,
            birthDate: item.Person?.birthDate,
            company: item.Company?.companyName,
            position: item.Position?.positionName,
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

  importEmployee(): void {
    const dialogRef = this.dialog.open(EmployeePageImportComponent, {
      width: '1200px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  editEmployee(item: EmployeeView): void {
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

  deleteEmployee(item: EmployeeView): void {
    if (confirm(`Deseja Realmente excluir o funcionário ${item.registration}?`)) {
      if (item.employeeId) {
        const payload: any = { ...item };

        delete payload.employeeId;
        delete payload.registration;
        delete payload.admissionDate;
        delete payload.fullName;
        delete payload.birthDate;
        delete payload.companyName;
        delete payload.positionName;
        delete payload.company;
        delete payload.position;
        delete payload.fkPersonId;
        delete payload.fkCompanyId;
        delete payload.fkPositionId;
        delete payload.fkSectorId;
        delete payload.fkDepartmentId;


        payload.activated = false;

        this.service.update(item.employeeId, payload).subscribe({
          next: () => {
            this.loadData();
          },
          error: (err) => {
            console.error('Erro ao excluir:', err);
            alert('Não foi possível excluir o item.');
          }
        });
      } else {
        console.error('Item sem ID não pode ser excluído');
      }
    }
  }
}
