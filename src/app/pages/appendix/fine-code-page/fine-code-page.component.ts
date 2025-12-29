import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FineCodeInterface } from './fine-code.interface';
import { MatPaginator } from '@angular/material/paginator';
import { FineCodeService } from './fine-code.service';
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
  ];

  dataSource: FineCodeInterface[] = [];

  constructor(
    private service: FineCodeService,
    private dialog: MatDialog // Injete o serviço de Dialog
  ) { }

  fineCodeSource = new MatTableDataSource<FineCodeInterface>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort; // 2. Capture o MatSort do HTML

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: (response: any) => {
        this.fineCodeSource.data = response.data;
        this.fineCodeSource.paginator = this.paginator;
        this.fineCodeSource.sort = this.sort; // 3. Vincule ao dataSource
        
        // 4. Opcional: Definir ordenação inicial padrão por 'fineNumber'
        this.sort.sort({ id: 'fineNumber', start: 'asc', disableClear: false });
      },
      error: (err) => console.error('Erro:', err)
    });
  }

  addFineCode(): void {
  const dialogRef = this.dialog.open(FineCodeFormComponent, {
    width: '500px'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // Se retornou true, recarregamos a tabela para mostrar o novo dado
      this.ngOnInit(); 
    }
  });
}

} 