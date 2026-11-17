import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { VehicleTypeInterface } from '../interfaces/vehicle.interface';

/** Tipos de veículo (`operations`). Só a listagem por ora; o CRUD vem na T14. */
@Injectable({
  providedIn: 'root'
})
export class VehicleTypeService {
  private API: string = environment.baseUrl + ':' + environment.operations_port + '/vehicle-type';

  constructor(private http: HttpClient) { }

  /** Lista os tipos ativos. Responde 404 quando não há nenhum. */
  list(): Observable<{ data: VehicleTypeInterface[] }> {
    return this.http.get<{ data: VehicleTypeInterface[] }>(this.API);
  }
}
