import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private API: string = environment.baseUrl + ':' + environment.registry_port + '/employee'

  constructor(private http: HttpClient) { }

  getAll(): Observable<any>{
    return this.http.get<any>(this.API)
  }
}
