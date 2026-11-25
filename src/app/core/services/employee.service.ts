import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EmployeeApi, EmployeeDTO } from '../interfaces/employee.interface';
import { ImportReport } from '../../shared/import-report/import-report.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private http = inject(HttpClient);

  private API: string = environment.baseUrl + ':' + environment.registry_port + '/employee'

  create(employee: EmployeeDTO): Observable<EmployeeDTO> {
    return this.http.post<EmployeeDTO>(this.API, employee);
  }

  update(employeeId: string, employee: Partial<EmployeeDTO>): Observable<EmployeeDTO> {
    return this.http.put<EmployeeDTO>(`${this.API}/${employeeId}`, employee);
  }

  /** Funcionários de uma empresa (`?fkCompanyId`); só ativos, exceto com `includeInactive` (T17). */
  getByCompany(companyId: string, includeInactive = false): Observable<{ data?: EmployeeApi[] }> {
    const params: Record<string, string> = { fkCompanyId: companyId };
    if (includeInactive) params['includeInactive'] = 'true';
    return this.http.get<{ data?: EmployeeApi[] }>(this.API, { params });
  }

  /** Reativa o funcionário e limpa a data de rescisão (T17); o usuário dele no `control` continua desativado. */
  reactivate(employeeId: string): Observable<unknown> {
    return this.http.patch(`${this.API}/${employeeId}/reactivate`, {});
  }

  /**
   * Desliga o funcionário (demissão, T20): grava a rescisão e desativa o usuário no `control`.
   * `pendingEmployeeIds` vem preenchido se o `control` falhou (usuário não desativado).
   */
  delete(employeeId: string, terminationDate: string): Observable<{ message: string; data?: { pendingEmployeeIds: string[] } }> {
    return this.http.delete<{ message: string; data?: { pendingEmployeeIds: string[] } }>(`${this.API}/${employeeId}`, { params: { terminationDate } });
  }

  /**
   * Desligamento em lote (T19, lista "fora da planilha"): tudo ou nada, uma data de rescisão para todos.
   * `pendingEmployeeIds` vem preenchido se o `control` falhou (usuários não desativados).
   */
  bulkDeactivate(ids: string[], terminationDate: string): Observable<{ message: string; data: { deactivated: number; pendingEmployeeIds: string[] } }> {
    return this.http.post<{ message: string; data: { deactivated: number; pendingEmployeeIds: string[] } }>(`${this.API}/bulk-deactivate`, { ids, terminationDate });
  }

  /** Importação em lote (`upsert`, tudo ou nada); `dryRun` só simula. */
  bulkImport(companyId: string, employees: object[], dryRun: boolean, confirmIds: string[] = []): Observable<{ data: ImportReport }> {
    const params = { mode: 'upsert', dryRun: String(dryRun) };
    return this.http.post<{ data: ImportReport }>(`${this.API}/bulk`, { companyId, employees, confirmIds }, { params });
  }
}
