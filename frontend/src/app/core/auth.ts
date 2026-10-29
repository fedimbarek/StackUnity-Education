import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { CanActivateFn, Router } from '@angular/router';
import { tap } from 'rxjs';

export const API = 'http://localhost:5000/api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  user = signal<string | null>(localStorage.getItem('username'));

  get token() { return localStorage.getItem('token'); }

  login(username: string, password: string) {
    return this.http.post<any>(`${API}/auth/login`, { username, password }).pipe(tap(r => this.save(r)));
  }
  register(username: string, password: string) {
    return this.http.post<any>(`${API}/auth/register`, { username, password }).pipe(tap(r => this.save(r)));
  }
  private save(r: { token: string; username: string }) {
    localStorage.setItem('token', r.token);
    localStorage.setItem('username', r.username);
    this.user.set(r.username);
  }
  logout() {
    localStorage.clear();
    this.user.set(null);
    this.router.navigate(['/login']);
  }
}

// Ajoute le token à chaque requête ; déconnecte si le serveur répond 401
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const t = auth.token;
  return next(t ? req.clone({ setHeaders: { Authorization: `Bearer ${t}` } }) : req).pipe(
    tap({ error: e => { if (e.status === 401 && !req.url.includes('/auth/')) auth.logout(); } })
  );
};

export const authGuard: CanActivateFn = () => {
  const ok = !!inject(AuthService).token;
  return ok || inject(Router).createUrlTree(['/login']);
};
