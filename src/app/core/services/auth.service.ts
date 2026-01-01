import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly AUTH_URL =  environment.baseUrl +':'+ environment.control_port;
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private userData = new BehaviorSubject<any>(this.getUserDataFromToken());

  constructor(private http: HttpClient, private router: Router) { }

  private hasToken(): boolean {
    const token = localStorage.getItem('access_token');
    return !! token && this.isTokenExpired(token);
  }

  login(login: string, password: string): Observable<any> {
    const authHeaders = new HttpHeaders({
      'X-Auth-User': login,
      'X-Auth-Pass': password,
      'X-Auth-Login': btoa(login +';'+password)
    });

    return this.http.post<any>(`${this.AUTH_URL}/auth/login`, {}, { headers: authHeaders }).pipe(
      tap(res => {
        if (res && res.data && res.data.token) {
          localStorage.setItem('access_token', res.data.token);
          this.loggedIn.next(true);
          // Atualiza os dados do usuário assim que logar
          this.userData.next(this.decodeToken(res.data.token));
        }
      })
    );
  }

  getUser(): Observable<any> {
    return this.userData.asObservable();
  }

  private getUserDataFromToken() {
    const token = localStorage.getItem('access_token');
    return token ? this.decodeToken(token) : null;
  }

  private decodeToken(token: string) {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(window.atob(payload));
      return decoded;
    }catch (e) {
      return null;
    }
  }

  private isTokenExpired(token: string) : boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return false;
    const expirationDate = decoded.exp *1000;
    return Date.now() > expirationDate;
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  logout() {
    localStorage.removeItem('access_token');
    this.loggedIn.next(false);
    this.userData.next(null);
    this.router.navigate(['/landingpage']);
  }
  
}
