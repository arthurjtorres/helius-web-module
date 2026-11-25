import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import DepartmentInterface from '../interfaces/department.interface';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private http = inject(HttpClient);


  private API: string = environment.baseUrl + ':' + environment.registry_port + '/department';

  getAll(): Observable<{ data: DepartmentInterface[] }> {
    return this.http.get<{ data: DepartmentInterface[] }>(this.API);
  }
}
