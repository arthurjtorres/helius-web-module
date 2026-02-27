import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import SectorInterface from '../interfaces/sector.interface';

@Injectable({
  providedIn: 'root'
})
export class SectorService {

  private API: string = environment.baseUrl + ':' + environment.registry_port + '/sector';

  constructor(private http: HttpClient) { }

  getAll(): Observable<SectorInterface[]> {
    return this.http.get<SectorInterface[]>(this.API);
  }
}
