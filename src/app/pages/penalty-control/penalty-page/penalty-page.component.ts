import { Component, OnInit, ViewChild } from '@angular/core';

import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { PenaltyInterface } from './penalty.interface';
import { PenaltyService } from './penalty.service';


@Component({
  selector: 'app-penalty-page',
  standalone: false,
  templateUrl: './penalty-page.component.html',
  styleUrl: './penalty-page.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
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
  
  penaltySource = new MatTableDataSource<PenaltyInterface>([]);
  expandedElement: PenaltyInterface | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
      private service: PenaltyService,
  
    ) { }
  
  ngOnInit(): void {
    this.loadData();
  }

  loadData() {

  }

  toggleRow(row: PenaltyInterface) {
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
