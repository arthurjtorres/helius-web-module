import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

import { StandardResponse } from '../utils/Response';
import { PenaltyCompositeView } from '../interfaces/penalty.interface';

@Injectable({
  providedIn: 'root'
})
export class PenaltyService {
  private http = inject(HttpClient);

  private API: string = environment.baseUrl + ':' + environment.juristic_port + '/penalty';
  private BASE: string = environment.baseUrl + ':' + environment.juristic_port;

   /** Visão composta das penalidades; só ativas, exceto com `includeInactive` (T17). */
   getCompositePenalties(includeInactive = false): Observable<StandardResponse<PenaltyCompositeView[]>> {
    return this.http.get<StandardResponse<PenaltyCompositeView[]>>(`${this.API}/composite`, includeInactive ? { params: { includeInactive: 'true' } } : {})
   }

  /** Reativa a penalidade (o evento, pai do documento; T17). */
  reactivatePenaltyInfo(penaltyInfoId: string): Observable<unknown> {
    return this.http.patch(`${this.BASE}/penalty-info/${penaltyInfoId}/reactivate`, {});
  }

  /** Reativa o documento (409 se a penalidade dele estiver inativa; T17). */
  reactivatePenaltyDoc(docId: string): Observable<unknown> {
    return this.http.patch(`${this.BASE}/penalty-doc/${docId}/reactivate`, {});
  }
}
