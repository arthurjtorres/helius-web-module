import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EmployeeDTO } from '../interfaces/employee.interface';

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

  bulkInsert(payload: any): Observable<any> {
  return this.http.post(`${this.API}/bulk`, payload);
}
}
