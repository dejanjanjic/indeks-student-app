import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginDTO } from '../model/login.model';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface AuthTokens {
  token: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private BASE_URL = 'http://localhost:8080/api/v1/auth';
  private readonly ACCES_TOKEN_KEY = 'authToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private router = inject(Router);

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(private http: HttpClient) {}

  public login(loginDTO: LoginDTO): Observable<AuthTokens> {
    return this.http.post(`${this.BASE_URL}/login`, loginDTO).pipe(
      tap({
        next: (response: any) => {
          if (response.token && response.refreshToken) {
            this.storeTokens(response.token, response.refreshToken);
            this.handleRedirection(response.token);
          } else {
            console.error('Login response missing tokens', response);
            this.logout();
            throw new Error('Login failed: Missing tokens');
          }
        },
        error: (error) => {
          console.error(error);
          throw error;
        },
      })
    );
  }
  private storeTokens(token: string, refreshToken: string): void {
    localStorage.setItem(this.ACCES_TOKEN_KEY, token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }
  public getToken(): string | null {
    return localStorage.getItem(this.ACCES_TOKEN_KEY);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  public getDecodedToken(): any {
    const token = this.getToken();
    return token ? jwtDecode(token) : null;
  }

  public getDecodedRefreshToken(): any {
    const refreshToken = this.getRefreshToken();
    return refreshToken ? jwtDecode(refreshToken) : null;
  }

  logout(): void {
    localStorage.removeItem(this.ACCES_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);

    this.refreshTokenSubject = new BehaviorSubject<any>(null);

    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  }

  public isTokenExpired(): boolean {
    const decodedToken = this.getDecodedToken();
    if (!decodedToken || !decodedToken.exp) {
      return true;
    }
    const expirationTime = decodedToken.exp * 1000;
    return Date.now() > expirationTime;
  }

  public isRefreshTokenExpired(): boolean {
    const decodedToken = this.getDecodedRefreshToken();
    if (!decodedToken || !decodedToken.exp) {
      return true;
    }
    const expirationTime = decodedToken.exp * 1000;
    const now = Date.now();
    return now > expirationTime;
  }

  public refreshToken(): Observable<AuthTokens | null> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken || this.isRefreshTokenExpired()) {
      console.warn(
        'Refresh token missing or expired. Cannot refresh. Logging out.'
      );
      this.logout();
      return throwError(() => new Error('Refresh token missing or expired'));
    }

    console.log('Attempting to refresh token...');

    return this.http
      .post<AuthTokens>(`${this.BASE_URL}/refresh`, { refreshToken })
      .pipe(
        tap((response: AuthTokens) => {
          if (response.token && response.refreshToken) {
            console.log('Tokens refreshed successfully.');
            this.storeTokens(response.token, response.refreshToken);
            this.refreshTokenSubject.next(response.token);
          } else {
            console.error(
              'Refresh token endpoint did not return expected tokens.'
            );
            this.logout();
            throw new Error('Refresh failed: Invalid response format');
          }
        }),
        catchError((error) => {
          console.error('Refresh token failed:', error);
          this.logout();
          this.refreshTokenSubject.next(null);
          return throwError(() => error);
        })
      );
  }

  public getUserRole(): string | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken?.accountType || null;
  }

  public getUserId(): number | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken?.accountId || null;
  }

  public getUsername(): string | null {
    const decodedToken = this.getDecodedToken();
    return `${decodedToken?.firstName} ${decodedToken?.lastName}` || null;
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
        this.router.navigate(['/admin']);
        break;
      case 'STUDENT':
        this.router.navigate(['/student']);
        break;
      default:
        this.logout();
        break;
    }
  }
}
