import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DocumentInterface } from '../interfaces/document.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private API: string = environment.baseUrl + ':' + environment.registry_port + '/document';

  constructor(private http: HttpClient) { }

  findDocuments(filters: Partial<DocumentInterface>): Observable<any> {
    let params = new HttpParams();

    if (filters.documentType) params = params.append('documentType', filters.documentType);
    if (filters.documentNumber) params = params.append('documentNumber', filters.documentNumber);

    return this.http.get<any>(`${this.API}`, { params });
  }

  create(document: DocumentInterface): Observable<DocumentInterface> {
    return this.http.post<DocumentInterface>(this.API, document);
  }

}
