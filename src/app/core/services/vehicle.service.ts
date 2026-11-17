import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VehicleInterface } from '../interfaces/vehicle.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ImportReport } from '../../shared/import-report/import-report.model';

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

  /** Veículos ativos de uma empresa (404 quando não há nenhum). */
  getVehiclesByCompany(companyId: string): Observable<{ data: VehicleInterface[] }> {
    return this.http.get<{ data: VehicleInterface[] }>(this.vehiclesAPI, { params: { fkVehicleCompanyId: companyId } });
  }

  /**
   * Importa veículos de uma empresa em `upsert` (tudo ou nada). Com falhas a API responde 400 com o
   * relatório em `error.data`.
   * @param confirmIds ids das diferenças confirmadas pelo usuário.
   */
  bulkImport(companyId: string, vehicles: object[], dryRun: boolean, confirmIds: string[] = []): Observable<{ data: ImportReport }> {
    const params = { mode: 'upsert', dryRun: String(dryRun) };
    return this.http.post<{ data: ImportReport }>(`${this.vehiclesAPI}/bulk`, { companyId, vehicles, confirmIds }, { params });
  }
}
