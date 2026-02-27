import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import PositionInterface from '../interfaces/position.interface';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  private API: string = environment.baseUrl + ':' + environment.registry_port + '/position';
  
    constructor(private http: HttpClient) { }
  
    getAll(): Observable<PositionInterface[]> {
      return this.http.get<PositionInterface[]>(this.API);
    }
}
