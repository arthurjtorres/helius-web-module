import { Component, OnInit, ViewChild } from '@angular/core';

import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


import { PenaltyCompositeView } from '../../../core/interfaces/penalty.interface';
import { PenaltyService } from '../../../core/services/penalty.service';
import { PenaltyDetailsComponent } from '../penalty-details/penalty-details.component';


@Component({
  selector: 'app-penalty-page',
  standalone: false,
  templateUrl: './penalty-page.component.html',
  styleUrl: './penalty-page.component.scss',
 
})
export class PenaltyPageComponent implements OnInit {

  penaltyHeader: string[] = [ 
    'ctdopNumber',
    'docRegistration',
    'company',
    'vehicleNumber',
    'busTimetableCode',
    'penaltyDate', 
    'fineCodeNumber',
    'location',
    'penaltyStatus',
    'appealProtocol', 
    'actions'
  ];
  
  penaltySource = new MatTableDataSource<PenaltyCompositeView>([]);
  expandedElement: PenaltyCompositeView | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
      private penaltyService: PenaltyService,
      private dialog: MatDialog  
    ) { }
  
  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.penaltyService.getCompositePenalties().subscribe({
      next: (response: any) => {
        const rawData = response.data || response;
        const activeData = rawData //falta colocar aqui o filtro de ativos

        this.penaltySource.data = activeData;
        this.penaltySource.paginator = this.paginator;
        this.penaltySource.sort = this.sort;

        if (this.sort) {
          this.sort.sort({ id: 'penaltyDate', start: 'asc', disableClear: false})
        }
      },
      error: (err) => {
        console.error('Erro ao buscar penalidades', err);
        
      }
    });
  }

  
  openDetailsDialog(penalty: PenaltyCompositeView) {
    this.dialog.open(PenaltyDetailsComponent, {
      width: '800px', // Um tamanho bom para ver muitos dados
      data: penalty   // Passamos o objeto inteiro da linha clicada para o dialog
    });
  }
  

  toggleRow(row: PenaltyCompositeView) {
    this.expandedElement = this.expandedElement === row ? null : row;
  }

  getAppealStatusClass(status?: string): string {
    if (!status) return 'status-none';
    
    switch(status.toLowerCase()) {
      case 'deferido': // Ganhou o recurso
      case 'aprovado':
        return 'status-green';
      case 'indeferido': // Perdeu o recurso
      case 'rejeitado':
        return 'status-red';
      case 'em análise':
      case 'pendente':
        return 'status-yellow';
      default:
        return 'status-default';
    }
  }

}
