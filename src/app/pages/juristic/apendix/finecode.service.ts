import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { FineCodeInterface } from "./interfaces/fineCode.interface";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FineCodeService {
  apiUrl: string = environment.apiUrl + 'fine-code';

  constructor(private http: HttpClient) { }

  create(fineCode: FineCodeInterface) : Observable<FineCodeInterface> {
    return this.http.post<FineCodeInterface>(this.apiUrl, fineCode);
  }


}