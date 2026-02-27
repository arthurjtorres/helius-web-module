import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

import { StandardResponse } from '../utils/Response';
import { PenaltyCompositeView } from '../interfaces/penalty.interface';

@Injectable({
  providedIn: 'root'
})
export class PenaltyService {
  private API: string = environment.baseUrl + ':' + environment.juristic_port + '/penalty';

  constructor(private http: HttpClient) { }

   getCompositePenalties(): Observable<StandardResponse<PenaltyCompositeView[]>> {
    return this.http.get<StandardResponse<PenaltyCompositeView[]>>(`${this.API}/composite`)
   }
}
