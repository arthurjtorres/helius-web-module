import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import CompanyInterface from '../interfaces/company.interface';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private http = inject(HttpClient);


  private API: string = environment.baseUrl + ':' + environment.registry_port + '/company';

   /** Lista as empresas ativas (envelope `{ data }` da API). */
   getAll(): Observable<{ data: CompanyInterface[] }> {
       return this.http.get<{ data: CompanyInterface[] }>(this.API);
     }
}
