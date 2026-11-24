 import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment"; 
import { HttpClient } from "@angular/common/http";
import { FineCodeInterface } from "../interfaces/fine-code.interface";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FineCodeService {
  private API: string = environment.baseUrl +':'+ environment.juristic_port + '/fine-code';
  

  constructor(private http: HttpClient) { }

  create(fineCode: FineCodeInterface) : Observable<FineCodeInterface> {
    return this.http.post<FineCodeInterface>(this.API, fineCode);
  }

  update(fineCodeId: string, fineCode: FineCodeInterface): Observable<FineCodeInterface> {
    return this.http.put<FineCodeInterface>(`${this.API}/${fineCodeId}`, fineCode);
  }

  /** Lista os códigos; só ativos, exceto com `includeInactive` (T17). */
  getAll(includeInactive = false) : Observable<FineCodeInterface[]> {
    return this.http.get<FineCodeInterface[]>(this.API, includeInactive ? { params: { includeInactive: 'true' } } : {});
  }

  /** Desativa o código (exclusão lógica; 409 se houver penalidades ativas). */
  delete(fineCodeId: string): Observable<unknown> {
    return this.http.delete(`${this.API}/${fineCodeId}`);
  }

  /** Reativa o código (T17). */
  reactivate(fineCodeId: string): Observable<unknown> {
    return this.http.patch(`${this.API}/${fineCodeId}/reactivate`, {});
  }
}

