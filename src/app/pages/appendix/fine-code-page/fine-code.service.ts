 import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment"; 
import { HttpClient } from "@angular/common/http";
import { FineCodeInterface } from "./fine-code.interface";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FineCodeService {
  apiUrl: string = environment.apiUrl + 'fine-code';
  private API: string = 'http://localhost:1030/fine-code';

  constructor(private http: HttpClient) { }

  create(fineCode: FineCodeInterface) : Observable<FineCodeInterface> {
    return this.http.post<FineCodeInterface>(this.API, fineCode);
  }

  getAll() : Observable<FineCodeInterface[]> {
    return this.http.get<FineCodeInterface[]>(this.API);
  }
}

