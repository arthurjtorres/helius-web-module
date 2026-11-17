import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VehicleInterface } from '../interfaces/vehicle.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private vehiclesAPI: string = environment.baseUrl + ':' + environment.operations_port + '/vehicle'

  constructor(private http: HttpClient) { }

  createVehicle(vehicle: VehicleInterface): Observable<unknown> {
    return this.http.post(this.vehiclesAPI, vehicle);
  }

  /** Atualiza o veículo; a API aceita campos parciais. */
  updateVehicle(vehicleId: string, vehicle: Partial<VehicleInterface>): Observable<unknown> {
    return this.http.put(`${this.vehiclesAPI}/${vehicleId}`, vehicle);
  }

  /** Desativa o veículo (exclusão lógica). */
  deleteVehicle(vehicleId: string): Observable<unknown> {
    return this.http.delete(`${this.vehiclesAPI}/${vehicleId}`);
  }

  getAllVehicles(): Observable<{ data: VehicleInterface[] }> {
    return this.http.get<{ data: VehicleInterface[] }>(this.vehiclesAPI);
  }
}
