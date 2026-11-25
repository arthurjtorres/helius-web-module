import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Usuário como listado pelo `control` (`GET /users`, sem senha). */
export interface UserSummary {
  userId: string;
  userName: string;
  email: string;
}

/** Empresa concedida a um usuário (`access_control.user_company`, T18). */
export interface UserCompanyLink {
  fkUserId: string;
  fkCompanyId: string;
}

/** Empresas concedidas a usuários (`control`, `/user-companies`, T18) e lista de colaboradores. */
@Injectable({
  providedIn: 'root'
})
export class UserCompanyService {
  private http = inject(HttpClient);

  private API = environment.baseUrl + ':' + environment.control_port;

  /** Usuários colaboradores ativos (exige `USUARIOS:READ`). Responde 404 quando não há nenhum. */
  getCollaborators(): Observable<{ data: UserSummary[] }> {
    return this.http.get<{ data: UserSummary[] }>(`${this.API}/users`, { params: { userType: 'COLABORADOR' } });
  }

  /** Empresas concedidas ao usuário (lista vazia é 200). */
  findByUser(fkUserId: string): Observable<{ data: UserCompanyLink[] }> {
    return this.http.get<{ data: UserCompanyLink[] }>(`${this.API}/user-companies`, { params: { fkUserId } });
  }

  /** Concede a empresa. O `control` confere clearance, grupo do funcionário e escopo (400/403/409 com mensagem). */
  grant(fkUserId: string, fkCompanyId: string): Observable<unknown> {
    return this.http.post(`${this.API}/user-companies`, { fkUserId, fkCompanyId });
  }

  /** Retira a empresa (remoção física do vínculo). */
  revoke(fkUserId: string, fkCompanyId: string): Observable<unknown> {
    return this.http.delete(`${this.API}/user-companies/${fkUserId}/${fkCompanyId}`);
  }
}
