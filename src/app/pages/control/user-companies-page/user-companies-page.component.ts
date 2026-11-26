import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';

import CompanyInterface from '../../../core/interfaces/company.interface';
import { CompanyService } from '../../../core/services/company.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UserCompanyLink, UserCompanyService, UserSummary } from '../../../core/services/user-company.service';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { CompanySelectComponent } from '../../../shared/company-select/company-select.component';
import { FormsModule } from '@angular/forms';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/list';
import { MatTooltip } from '@angular/material/tooltip';

/**
 * Controle › Empresas do usuário (T18, ADR-021): concede e retira empresas extras de um colaborador.
 * A empresa do próprio funcionário já vem no login e não aparece aqui.
 */
@Component({
    selector: 'app-user-companies-page',
    templateUrl: './user-companies-page.component.html',
    styleUrl: '../../vehicles/vehicle-page/vehicle-page.component.scss',
    imports: [MatFormField, MatLabel, MatSelect, MatOption, CompanySelectComponent, FormsModule, MatFabButton, MatIcon, MatDivider, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatIconButton, MatTooltip, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow]
})
export class UserCompaniesPageComponent implements OnInit {
  private service = inject(UserCompanyService);
  private companyService = inject(CompanyService);
  private notification = inject(NotificationService);

  readonly columns = ['company', 'actions'];
  // shortcut: lista todos os colaboradores num select; trocar por busca no servidor quando houver muitos usuários.
  readonly users = signal<UserSummary[]>([]);
  userId = '';
  companyId = '';
  dataSource = new MatTableDataSource<UserCompanyLink>([]);
  /** Empresas visíveis a quem concede, para mostrar o nome. */
  private readonly companyNames = signal(new Map<string, string>());

  ngOnInit(): void {
    this.service.getCollaborators().subscribe({
      next: res => this.users.set(res.data ?? []),
      error: (err: HttpErrorResponse) => this.fail(err, 'Não foi possível carregar os usuários.'),
    });
    this.companyService.getAll().subscribe({
      next: res => this.companyNames.set(new Map((res.data ?? []).map((c: CompanyInterface) => [c.companyId ?? '', `${c.companyName} (${c.companyAcronym})`]))),
      error: (err: HttpErrorResponse) => this.fail(err, 'Não foi possível carregar as empresas.'),
    });
  }

  /** Nome da empresa, ou o id se ela estiver fora do escopo de quem consulta. */
  companyName(id: string): string {
    return this.companyNames().get(id) ?? id;
  }

  selectUser(userId: string): void {
    this.userId = userId;
    this.loadLinks();
  }

  loadLinks(): void {
    if (!this.userId) return;
    this.service.findByUser(this.userId).subscribe({
      next: res => this.dataSource.data = res.data ?? [],
      error: (err: HttpErrorResponse) => this.fail(err, 'Não foi possível carregar as empresas do usuário.'),
    });
  }

  grant(): void {
    if (!this.userId || !this.companyId) return;
    this.service.grant(this.userId, this.companyId).subscribe({
      next: () => {
        this.notification.info('Empresa concedida.');
        this.loadLinks();
      },
      error: (err: HttpErrorResponse) => this.fail(err, 'Não foi possível conceder a empresa.'),
    });
  }

  revoke(link: UserCompanyLink): void {
    if (!confirm(`Retirar o acesso à empresa ${this.companyName(link.fkCompanyId)}?`)) return;
    this.service.revoke(link.fkUserId, link.fkCompanyId).subscribe({
      next: () => {
        this.notification.info('Empresa retirada.');
        this.loadLinks();
      },
      error: (err: HttpErrorResponse) => this.fail(err, 'Não foi possível retirar a empresa.'),
    });
  }

  /** 404 = lista vazia; 403 já é avisado pelo interceptor (T13); demais erros mostram a mensagem do backend. */
  private fail(err: HttpErrorResponse, fallback: string): void {
    if (err.status === 404 || err.status === 403) return;
    this.notification.error(err.error?.message || fallback);
  }
}
