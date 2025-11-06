import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FINECODE_DATA, FineCodeInterface } from './apendix.data';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
selector: 'app-apendix',
standalone: false,
templateUrl: './apendix.component.html',
styleUrl: './apendix.component.scss'
})
export class ApendixComponent implements AfterViewInit {
fineCodeHeader: string[] = [
'fineCodeId',
'fineDescription',
'fineKm',
'fineAlias',
'fineOrder'
];

fineCodeSource = new MatTableDataSource<FineCodeInterface>(FINECODE_DATA);

@ViewChild(MatPaginator) paginator: MatPaginator | any;

ngAfterViewInit() {
this.fineCodeSource.paginator = this.paginator;
}

edit(fineCode: FineCodeInterface){

}

}



/*

import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { 
  FINECODE_DATA, 
  FineCodeInterface,
  MOTIVO_DATA,
  MotiveInterface,
  EMPRESA_DATA,
  CompanyInterface
} from './interfaces';

import { FineCodeDialogComponent } from './dialogs/fine-code-dialog/fine-code-dialog.component';
import { MotiveDialogComponent } from './dialogs/motive-dialog/motive-dialog.component';
import { CompanyDialogComponent } from './dialogs/company-dialog/company-dialog.component';

@Component({
  selector: 'app-apendix',
  standalone: false,
  templateUrl: './apendix.component.html',
  styleUrls: ['./apendix.component.scss']
})
export class ApendixComponent implements AfterViewInit {
  
  // Fine Code Table
  fineCodeColumns: string[] = [
    'fineCodeId',
    'fineDescription',
    'fineKm',
    'fineAlias',
    'fineOrder'
  ];
  fineCodeSource = new MatTableDataSource<FineCodeInterface>(FINECODE_DATA);
  @ViewChild('fineCodePaginator') fineCodePaginator!: MatPaginator;
  @ViewChild('fineCodeSort') fineCodeSort!: MatSort;

  // Motivo Table
  motivoColumns: string[] = [
    'motivoId',
    'motivoDescription',
    'motivoCode',
    'motivoActive'
  ];
  motivoSource = new MatTableDataSource<MotiveInterface>(MOTIVO_DATA);
  @ViewChild('motivoPaginator') motivoPaginator!: MatPaginator;
  @ViewChild('motivoSort') motivoSort!: MatSort;

  // Empresa Table
  empresaColumns: string[] = [
    'empresaId',
    'empresaName',
    'empresaCnpj',
    'empresaCity',
    'empresaState',
    'empresaActive'
  ];
  empresaSource = new MatTableDataSource<CompanyInterface>(EMPRESA_DATA);
  @ViewChild('empresaPaginator') empresaPaginator!: MatPaginator;
  @ViewChild('empresaSort') empresaSort!: MatSort;

  constructor(public dialog: MatDialog) {}

  ngAfterViewInit() {
    // Configure Fine Code Table
    this.fineCodeSource.paginator = this.fineCodePaginator;
    this.fineCodeSource.sort = this.fineCodeSort;

    // Configure Motivo Table
    this.motivoSource.paginator = this.motivoPaginator;
    this.motivoSource.sort = this.motivoSort;

    // Configure Empresa Table
    this.empresaSource.paginator = this.empresaPaginator;
    this.empresaSource.sort = this.empresaSort;
  }

  // Filter functions
  applyFineCodeFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.fineCodeSource.filter = filterValue.trim().toLowerCase();

    if (this.fineCodeSource.paginator) {
      this.fineCodeSource.paginator.firstPage();
    }
  }

  applyMotivoFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.motivoSource.filter = filterValue.trim().toLowerCase();

    if (this.motivoSource.paginator) {
      this.motivoSource.paginator.firstPage();
    }
  }

  applyEmpresaFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.empresaSource.filter = filterValue.trim().toLowerCase();

    if (this.empresaSource.paginator) {
      this.empresaSource.paginator.firstPage();
    }
  }

  // Dialog functions
  openFineCodeDialog() {
    const dialogRef = this.dialog.open(FineCodeDialogComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Adicionar novo item à tabela
        const currentData = this.fineCodeSource.data;
        currentData.push(result);
        this.fineCodeSource.data = currentData;
      }
    });
  }

  openMotivoDialog() {
    const dialogRef = this.dialog.open(MotiveDialogComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const currentData = this.motivoSource.data;
        currentData.push(result);
        this.motivoSource.data = currentData;
      }
    });
  }

  openEmpresaDialog() {
    const dialogRef = this.dialog.open(CompanyDialogComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const currentData = this.empresaSource.data;
        currentData.push(result);
        this.empresaSource.data = currentData;
      }
    });
  }
}

*/