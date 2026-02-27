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

  getAll() : Observable<FineCodeInterface[]> {
    return this.http.get<FineCodeInterface[]>(this.API);
  }
}

