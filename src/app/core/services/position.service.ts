import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import PositionInterface from '../interfaces/position.interface';

/** Cargos (`registry`, `/position`). */
@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private http = inject(HttpClient);


  private API: string = environment.baseUrl + ':' + environment.registry_port + '/position';

  /** Lista os cargos (envelope `{ data }`); só ativos, exceto com `includeInactive` (T17). Responde 404 quando não há nenhum. */
  getAll(includeInactive = false): Observable<{ data: PositionInterface[] }> {
    return this.http.get<{ data: PositionInterface[] }>(this.API, includeInactive ? { params: { includeInactive: 'true' } } : {});
  }

  /** Cria um cargo. 409 se o nome já existir (com `data.id` quando o existente estiver inativo). */
  create(position: PositionInterface): Observable<unknown> {
    return this.http.post(this.API, position);
  }

  /** Atualiza um cargo; mesmo 409 do `create` para nome duplicado. */
  update(id: string, position: Partial<PositionInterface>): Observable<unknown> {
    return this.http.put(`${this.API}/${id}`, position);
  }

  /** Desativa (exclusão lógica). 409 se houver funcionários ativos no cargo. */
  delete(id: string): Observable<unknown> {
    return this.http.delete(`${this.API}/${id}`);
  }

  /** Reativa um cargo desativado. */
  reactivate(id: string): Observable<unknown> {
    return this.http.patch(`${this.API}/${id}/reactivate`, {});
  }
}
