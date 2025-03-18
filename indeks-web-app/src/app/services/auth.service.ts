import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginDTO } from '../model/login.model';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private BASE_URL = 'http://localhost:8080/api/v1/auth';
  private readonly STORAGE_KEY = 'authToken';
  private router = inject(Router);

  constructor(private http: HttpClient) {}

  public login(loginDTO: LoginDTO): Observable<any> {
    return this.http.post(`${this.BASE_URL}/login`, loginDTO).pipe(
      tap({
        next: (response: any) => {
          if (response.token) {
            this.storeToken(response.token);
            this.handleRedirection(response.token);
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          throw error;
        },
      })
    );
  }
  private storeToken(token: string): void {
    localStorage.setItem(this.STORAGE_KEY, token);
  }
  public getToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }
  public getDecodedToken(): any {
    const token = this.getToken();
    return token ? jwtDecode(token) : null;
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  public getUserRole(): string | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken?.accountType || null;
  }

  public handleRedirection(token?: string): void {
    let decodedToken: any = null;
    if (typeof token === 'undefined') {
      decodedToken = jwtDecode(this.getToken()!);
    } else {
      decodedToken = jwtDecode(token!);
    }

    console.log(decodedToken);
    const role = decodedToken?.accountType?.toUpperCase();

    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'STUDENT':
        this.router.navigate(['/student/profile']);
        break;
      default:
        this.logout();
        break;
    }
  }
}
