import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DocumentInterface } from '../interfaces/document.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Documento com a pessoa incluída (`GET /document`). */
type DocumentWithPerson = DocumentInterface & { Person?: { personId: string; fullName: string; birthDate?: string } };

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private API: string = environment.baseUrl + ':' + environment.registry_port + '/document';

  constructor(private http: HttpClient) { }

  findDocuments(filters: Partial<DocumentInterface>): Observable<{ data: DocumentWithPerson[] }> {
    let params = new HttpParams();

    if (filters.documentType) params = params.append('documentType', filters.documentType);
    if (filters.documentNumber) params = params.append('documentNumber', filters.documentNumber);

    return this.http.get<{ data: DocumentWithPerson[] }>(`${this.API}`, { params });
  }

  create(document: DocumentInterface): Observable<DocumentInterface> {
    return this.http.post<DocumentInterface>(this.API, document);
  }

}
