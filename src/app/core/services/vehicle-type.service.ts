import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { VehicleTypeInterface } from '../interfaces/vehicle.interface';

/** Tipos de veículo (`operations`, `/vehicle-type`). */
@Injectable({
  providedIn: 'root'
})
export class VehicleTypeService {
  private API: string = environment.baseUrl + ':' + environment.operations_port + '/vehicle-type';

  constructor(private http: HttpClient) { }

  /** Lista os tipos; só ativos, exceto com `includeInactive` (T17). Responde 404 quando não há nenhum. */
  list(includeInactive = false): Observable<{ data: VehicleTypeInterface[] }> {
    return this.http.get<{ data: VehicleTypeInterface[] }>(this.API, includeInactive ? { params: { includeInactive: 'true' } } : {});
  }

  /** Cria um tipo. 409 se o nome já existir (com `data.id` quando o existente estiver inativo). */
  create(type: VehicleTypeInterface): Observable<unknown> {
    return this.http.post(this.API, type);
  }

  /** Atualiza um tipo; mesmo 409 do `create` para nome duplicado. */
  update(id: string, type: Partial<VehicleTypeInterface>): Observable<unknown> {
    return this.http.put(`${this.API}/${id}`, type);
  }

  /** Desativa (exclusão lógica). 409 se houver veículos ativos do tipo. */
  delete(id: string): Observable<unknown> {
    return this.http.delete(`${this.API}/${id}`);
  }

  /** Reativa um tipo desativado. */
  reactivate(id: string): Observable<unknown> {
    return this.http.patch(`${this.API}/${id}/reactivate`, {});
  }
}
