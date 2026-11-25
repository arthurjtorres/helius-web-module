import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PersonInterface } from '../interfaces/person.interface';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private http = inject(HttpClient);

  private API: string = environment.baseUrl + ':' + environment.registry_port + '/person';

  create(person: PersonInterface): Observable<{ data: PersonInterface }> {
    return this.http.post<{ data: PersonInterface }>(this.API, person);
  }
}
