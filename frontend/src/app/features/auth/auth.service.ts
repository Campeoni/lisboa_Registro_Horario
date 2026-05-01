import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

const TOKEN_KEY = 'access_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  readonly isAuthenticated = computed(() => !!this.token());
  readonly role = signal<string | null>(null);

  constructor() {
    this.loadRoleFromToken();
  }

  private loadRoleFromToken() {
    const token = this.token();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.role.set(payload.role || null);
      } catch {
        this.role.set(null);
      }
    }
  }

  login(payload: LoginPayload) {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, payload)
      .pipe(
        tap((res) => {
          localStorage.setItem(TOKEN_KEY, res.access_token);
          this.token.set(res.access_token);
          this.loadRoleFromToken();
        }),
      );
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this.token.set(null);
    this.role.set(null);
    void this.router.navigate(['/auth/login']);
  }

  isWorker(): boolean {
    return this.role() === 'WORKER';
  }

  isSupervisorOrRoot(): boolean {
    const r = this.role();
    return r === 'SUPERVISOR' || r === 'ROOT';
  }
}
