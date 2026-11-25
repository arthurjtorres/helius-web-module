import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';

import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


import { PenaltyCompositeView } from '../../../core/interfaces/penalty.interface';
import { PenaltyService } from '../../../core/services/penalty.service';
import { PenaltyDetailsComponent } from '../penalty-details/penalty-details.component';
import { HttpErrorResponse } from '@angular/common/http';
import { of, switchMap } from 'rxjs';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-penalty-page',
  standalone: false,
  templateUrl: './penalty-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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

  /** Inativos listados (checkbox "Ocultar inativos" desmarcado, T17). */
  includeInactive = false;

  constructor(
      private penaltyService: PenaltyService,
      private dialog: MatDialog,
      private notification: NotificationService,
      auth: AuthService,
    ) {
    // Coluna de situação sempre visível para quem pode ver inativos (T17, regra 3)
    if (auth.canSeeInactive('PENALIDADES')) this.penaltyHeader.splice(this.penaltyHeader.length - 1, 0, 'status');
  }
  
  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.penaltyService.getCompositePenalties(this.includeInactive).subscribe({
      next: (response) => {
        // o backend já filtra os ativos (T17: inativos só com includeInactive)
        this.penaltySource.data = ('data' in response && response.data) || [];
        this.penaltySource.paginator = this.paginator;
        this.penaltySource.sort = this.sort;

        if (this.sort) {
          this.sort.sort({ id: 'penaltyDate', start: 'asc', disableClear: false})
        }
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) this.penaltySource.data = [];
        else console.error('Erro ao buscar penalidades', err);
      }
    });
  }

  
  openDetailsDialog(penalty: PenaltyCompositeView) {
    this.dialog.open(PenaltyDetailsComponent, {
      width: '800px', // Um tamanho bom para ver muitos dados
      data: penalty   // Passamos o objeto inteiro da linha clicada para o dialog
    });
  }
  

  /**
   * Reativa o documento após confirmação (T17). Se a penalidade (pai) também estiver inativa,
   * reativa ela antes; senão o backend responde 409. Erros mostram a mensagem da API.
   */
  reactivatePenalty(item: PenaltyCompositeView): void {
    if (!confirm(`Deseja reativar a penalidade ${item.docRegistration ?? ''}?`)) return;
    const parent$ = item.penaltyActivated === false && item.penaltyInfoId
      ? this.penaltyService.reactivatePenaltyInfo(item.penaltyInfoId)
      : of(null);
    parent$.pipe(switchMap(() => this.penaltyService.reactivatePenaltyDoc(item.docId))).subscribe({
      next: () => {
        this.notification.info('Penalidade reativada.');
        this.loadData();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status !== 403) this.notification.error(err.error?.message || 'Não foi possível reativar a penalidade.');
        this.loadData();
      }
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
