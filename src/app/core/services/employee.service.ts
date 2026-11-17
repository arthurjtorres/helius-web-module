import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EmployeeDTO } from '../interfaces/employee.interface';
import { ImportReport } from '../../shared/import-report/import-report.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private API: string = environment.baseUrl + ':' + environment.registry_port + '/employee'

  constructor(private http: HttpClient) { }

  create(employee: EmployeeDTO): Observable<EmployeeDTO> {
    return this.http.post<EmployeeDTO>(this.API, employee);
  }

  update(employeeId: string, employee: Partial<EmployeeDTO>): Observable<EmployeeDTO> {
    return this.http.put<EmployeeDTO>(`${this.API}/${employeeId}`, employee);
  }

  getAll(): Observable<any>{
    return this.http.get<any>(this.API)
  }

  /** Importação em lote (`upsert`, tudo ou nada); `dryRun` só simula. */
  bulkImport(companyId: string, employees: object[], dryRun: boolean, confirmIds: string[] = []): Observable<{ data: ImportReport }> {
    const params = { mode: 'upsert', dryRun: String(dryRun) };
    return this.http.post<{ data: ImportReport }>(`${this.API}/bulk`, { companyId, employees, confirmIds }, { params });
  }
}
