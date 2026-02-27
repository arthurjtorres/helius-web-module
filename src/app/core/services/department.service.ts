import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import DepartmentInterface from '../interfaces/department.interface';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private API: string = environment.baseUrl + ':' + environment.registry_port + '/department';

  constructor(private http: HttpClient) { }

  getAll(): Observable<DepartmentInterface[]> {
    return this.http.get<DepartmentInterface[]>(this.API);
  }
}
