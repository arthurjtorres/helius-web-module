import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../../core/services/notification.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeDTO, EmployeeView } from '../../../core/interfaces/employee.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { EmployeePageFormComponent } from '../employee-page-form/employee-page-form.component';
import { EmployeeService } from '../../../core/services/employee.service';
import { EmployeePageImportComponent } from '../employee-page-import/employee-page-import.component';
import { EmployeePageTerminationComponent } from '../employee-page-termination/employee-page-termination.component';

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

  /** Empresa escolhida no combobox; a tabela fica vazia até a escolha. */
  companyId = '';

  constructor(
    private service: EmployeeService,
    private dialog: MatDialog,
    private notification: NotificationService,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  /** Funcionários ativos da empresa escolhida; vazio até escolher (T19). 404 = nenhum; 403 já é avisado pelo interceptor. */
  loadData() {
    if (!this.companyId) return this.showEmployees([]);
    this.service.getByCompany(this.companyId).subscribe({
      next: (response: any) => {
        const mappedData: EmployeeView[] = (response.data || []).map((item: any) => ({
          employeeId: item.employeeId,
          fkPersonId: item.fkPersonId,
          fkCompanyId: item.fkCompanyId,
          fkPositionId: item.fkPositionId,
          fkSectorId: item.fkSectorId,
          fkDepartmentId: item.fkDepartmentId,
          registration: item.registration,
          admissionDate: item.admissionDate,
          fullName: item.Person?.fullName,
          birthDate: item.Person?.birthDate,
          company: item.Company?.companyName,
          position: item.Position?.positionName,
          activated: item.activated,
        }));
        this.showEmployees(mappedData);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) return this.showEmployees([]);
        if (err.status !== 403) this.notification.error('Não foi possível carregar os funcionários.');
      }
    })
  }

  private showEmployees(employees: EmployeeView[]): void {
    this.employeeDataSource.data = employees;
    setTimeout(() => {
      this.employeeDataSource.paginator = this.paginator;
      this.employeeDataSource.sort = this.sort;
    });
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

  /** Desliga o funcionário (demissão, T20): pede a data de rescisão no diálogo e chama o `DELETE`. */
  deleteEmployee(item: EmployeeView): void {
    const employeeId = item.employeeId;
    if (!employeeId) return;
    this.dialog.open(EmployeePageTerminationComponent, { width: '480px', data: item }).afterClosed().subscribe((date?: string) => {
      if (!date) return;
      this.service.delete(employeeId, date).subscribe({
        next: (response) => {
          // `control` fora: funcionário desligado, usuário ainda ativo
          if (response.data?.pendingEmployeeIds?.length) this.notification.error(response.message);
          else this.notification.info('Funcionário desligado.');
          this.loadData();
        },
        error: (err: HttpErrorResponse) => {
          if (err.status !== 403) this.notification.error(err.error?.message || 'Não foi possível desligar o funcionário.');
        }
      });
    });
  }
}
