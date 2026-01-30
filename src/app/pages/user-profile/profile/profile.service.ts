import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private controlApi = `${environment.baseUrl}:${environment.control_port}`;
  private juristicApi = `${environment.baseUrl}:${environment.juristic_port}`;

  constructor(private http: HttpClient) { }

  getBasicInfo() {
    return this.http.get(`${this.controlApi}`)
  }
}
