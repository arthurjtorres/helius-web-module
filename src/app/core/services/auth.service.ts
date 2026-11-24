import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly AUTH_URL = environment.baseUrl + ':' + environment.control_port;

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private userData = new BehaviorSubject<any>(this.getUserDataFromToken());

  constructor(private http: HttpClient, private router: Router) { }

  private hasToken(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token && !this.isTokenExpired(token);
  }

  login(login: string, password: string): Observable<any> {
    const authHeaders = new HttpHeaders({
      'Authorization': btoa(password + ';' + login)
    });

    return this.http.post<any>(`${this.AUTH_URL}/authenticate`, {}, { headers: authHeaders }).pipe(
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
    } catch (e) {
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return false;
    const expirationDate = decoded.exp * 1000;
    return Date.now() > expirationDate;
  }

  /**
   * Se o usuário pode ver inativos no menu (T17, regra 2): acesso total (clearance `SUPER_ADMIN` ou
   * acima, ou role `DESENVOLVEDOR`, como o `hasFullAccess` do backend) ou `CREATE`/`UPDATE`/`DELETE`
   * no menu. Só mostra ou esconde o controle: quem autoriza é o backend.
   * @param menu Nome do menu (`menu.menu_name`), ex.: `FUNCIONARIOS`.
   */
  canSeeInactive(menu: string): boolean {
    const user = this.userData.value;
    if (!user) return false;
    if (['SYSTEM_ADMIN', 'SUPER_ADMIN'].includes(user.clearance)) return true;
    if ((user.roles ?? []).some((r: { role: string }) => r.role === 'DESENVOLVEDOR')) return true;
    const permissions: string[] = (user.allowedMenus ?? []).find((m: { menu: string }) => m.menu === menu)?.permissions ?? [];
    return permissions.some(p => ['CREATE', 'UPDATE', 'DELETE'].includes(p));
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) return false;

    if (this.isTokenExpired(token)) {
      this.logout();
      return false;
    }
    return true;
  }

  logout() {
    localStorage.removeItem('access_token');
    this.loggedIn.next(false);
    this.userData.next(null);
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

}
