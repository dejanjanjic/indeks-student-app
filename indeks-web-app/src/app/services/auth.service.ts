import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginDTO } from '../model/login.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

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
          console.error(error);
          throw error;
        },
      })
    );
  }
  private storeToken(token: string): void {
    localStorage.setItem(this.ACCES_TOKEN_KEY, token);
  }
  public getToken(): string | null {
    return localStorage.getItem(this.ACCES_TOKEN_KEY);
  }
  public getDecodedToken(): any {
    const token = this.getToken();
    return token ? jwtDecode(token) : null;
  }

  logout(): void {
    localStorage.removeItem(this.ACCES_TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
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
