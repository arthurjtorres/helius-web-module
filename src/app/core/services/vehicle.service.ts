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

  createVehicle(vehicle: VehicleInterface): Observable<VehicleInterface> {
    return this.http.post<VehicleInterface>(this.vehiclesAPI, vehicle);
  }

  getAllVehicles(): Observable<VehicleInterface[]> {
    return this.http.get<VehicleInterface[]>(this.vehiclesAPI);
  }
}
