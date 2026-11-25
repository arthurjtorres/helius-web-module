import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import SectorInterface from '../interfaces/sector.interface';

@Injectable({
  providedIn: 'root'
})
export class SectorService {
  private http = inject(HttpClient);


  private API: string = environment.baseUrl + ':' + environment.registry_port + '/sector';

  getAll(): Observable<{ data: SectorInterface[] }> {
    return this.http.get<{ data: SectorInterface[] }>(this.API);
  }
}
