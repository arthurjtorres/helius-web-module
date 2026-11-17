import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import PositionInterface from '../interfaces/position.interface';

/** Cargos (`registry`, `/position`). */
@Injectable({
  providedIn: 'root'
})
export class PositionService {

  private API: string = environment.baseUrl + ':' + environment.registry_port + '/position';

  constructor(private http: HttpClient) { }

  /** Lista os cargos ativos (envelope `{ data }`). Responde 404 quando não há nenhum. */
  getAll(): Observable<{ data: PositionInterface[] }> {
    return this.http.get<{ data: PositionInterface[] }>(this.API);
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
