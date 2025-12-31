import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL = 'http://localhost:1010';

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router) { }

  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

  login(login: string, password: string): Observable<any> {
    const authHeaders = new HttpHeaders({
      'X-Auth-User': login,
      'X-Auth-Pass': password
    });

    return this.http.post<any>(`${this.API_URL}/auth/login`, {}, {headers: authHeaders }).pipe(
      tap(res => {
        if (res && res.data && res.data.token) {
          localStorage.setItem('access_token', res.data.token);
          this.loggedIn.next(true);
        }
      })
    );
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  logout() {
    localStorage.removeItem('access_token');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
  
}
