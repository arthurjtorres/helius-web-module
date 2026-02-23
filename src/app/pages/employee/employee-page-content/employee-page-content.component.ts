import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeInterface } from '../employee.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { FineCodeService } from '../../appendix/fine-code-page/fine-code.service';
import { EmployeePageFormComponent } from '../employee-page-form/employee-page-form.component';

@Component({
  selector: 'app-employee-page-content',
  standalone: false,
  templateUrl: './employee-page-content.component.html',
  styleUrl: './employee-page-content.component.scss'
})
export class EmployeePageContentComponent implements OnInit {

  employeeHeader: string[] = [
    'registration'
  ]

  employeeDataSource = new MatTableDataSource<EmployeeInterface>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: FineCodeService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {

  }

  addEmployee(): void {
    const dialogRef = this.dialog.open(EmployeePageFormComponent, {
      width: '1200px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.loadData();
      }
    });
  }
}
