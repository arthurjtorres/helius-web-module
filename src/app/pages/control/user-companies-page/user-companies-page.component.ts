import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';

import CompanyInterface from '../../../core/interfaces/company.interface';
import { CompanyService } from '../../../core/services/company.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UserCompanyLink, UserCompanyService, UserSummary } from '../../../core/services/user-company.service';

/**
 * Controle › Empresas do usuário (T18, ADR-021): concede e retira empresas extras de um colaborador.
 * A empresa do próprio funcionário já vem no login e não aparece aqui.
 */
@Component({
  selector: 'app-user-companies-page',
  standalone: false,
  templateUrl: './user-companies-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: '../../vehicles/vehicle-page/vehicle-page.component.scss'
})
export class UserCompaniesPageComponent implements OnInit {
  private service = inject(UserCompanyService);
  private companyService = inject(CompanyService);
  private notification = inject(NotificationService);

  readonly columns = ['company', 'actions'];
  // shortcut: lista todos os colaboradores num select; trocar por busca no servidor quando houver muitos usuários.
  users: UserSummary[] = [];
  userId = '';
  companyId = '';
  dataSource = new MatTableDataSource<UserCompanyLink>([]);
  /** Empresas visíveis a quem concede, para mostrar o nome. */
  private companyNames = new Map<string, string>();

  ngOnInit(): void {
    this.service.getCollaborators().subscribe({
      next: res => this.users = res.data ?? [],
      error: (err: HttpErrorResponse) => this.fail(err, 'Não foi possível carregar os usuários.'),
    });
    this.companyService.getAll().subscribe({
      next: res => (res.data ?? []).forEach((c: CompanyInterface) => this.companyNames.set(c.companyId ?? '', `${c.companyName} (${c.companyAcronym})`)),
      error: (err: HttpErrorResponse) => this.fail(err, 'Não foi possível carregar as empresas.'),
    });
  }

  /** Nome da empresa, ou o id se ela estiver fora do escopo de quem consulta. */
  companyName(id: string): string {
    return this.companyNames.get(id) ?? id;
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
