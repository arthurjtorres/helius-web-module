import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FineCodeInterface } from '../../../core/interfaces/fine-code.interface';
import { MatPaginator } from '@angular/material/paginator';
import { FineCodeService } from '../../../core/services/fine-code.service';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { FineCodeFormComponent } from '../fine-code-form/fine-code-form.component';

@Component({
  selector: 'app-fine-code-page',
  standalone: false,
  templateUrl: './fine-code-page.component.html',
  styleUrl: './fine-code-page.component.scss'
})
export class FineCodePageComponent implements OnInit {

  fineCodeHeader: string[] = [
    'fineNumber',
    'fineDescription',
    'fineKm',
    'fineAlias',
    'fineOrder',
    'actions'
  ];

  fineCodeSource = new MatTableDataSource<FineCodeInterface>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: FineCodeService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.getAll().subscribe({
      next: (response: any) => {
        const rawData = response.data || response;
        const activeData = rawData.filter((item: FineCodeInterface) => item.activated !== false);

        this.fineCodeSource.data = activeData;
        this.fineCodeSource.paginator = this.paginator;
        this.fineCodeSource.sort = this.sort;

        if (this.sort) {
          this.sort.sort({ id: 'fineNumber', start: 'asc', disableClear: false });
        }
      },
      error: (err) => console.error('Erro:', err)
    });
  }

  addFineCode(): void {
    const dialogRef = this.dialog.open(FineCodeFormComponent, {
      width: '1000px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  editFineCode(item: FineCodeInterface) {
    const dialogRef = this.dialog.open(FineCodeFormComponent, {
      width: '1000px',
      disableClose: true,
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  deleteFineCode(item: FineCodeInterface) {
    if (confirm(`Deseja Realmente excluir o código de multa ${item.fineNumber}?`)) {
      if (item.fineCodeId) {
        const payload: any = { ...item};

        delete payload.fineCodeId;
        delete payload.createdAt;

        delete payload.createdBy;
        delete payload.updatedAt;
        delete payload.updatedBy;
        payload.activated = false;

        this.service.update(item.fineCodeId, payload).subscribe({
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.fineCodeSource.filter = filterValue.trim().toLowerCase();

    if (this.fineCodeSource.paginator) {
      this.fineCodeSource.paginator.firstPage();
    }
  }
} 