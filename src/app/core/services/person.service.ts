import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PersonInterface } from '../interfaces/person.interface';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private API: string = environment.baseUrl + ':' + environment.registry_port + '/person';

  constructor(private http: HttpClient) { }

  create(person: PersonInterface): Observable<PersonInterface> {
    return this.http.post<PersonInterface>(this.API, person);
  }
}
