import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private BASE_URL = 'http://localhost:8080/api/v1/account';

  constructor(private http: HttpClient) { }

  getAccountRoleByEmail(email: string): Observable<string> {
    const params = new HttpParams().set('email', email);
    return this.http.get(`${this.BASE_URL}/email`, {
      params,
      responseType: 'text'
    });
  }
  getAccountIdByEmail(email: string): Observable<number> {
    const params = new HttpParams().set('email', email);
    return this.http.get(`${this.BASE_URL}/id-by-email`, {
      params,
      responseType: 'text'
    }).pipe(
      // Ako želiš da rezultat odmah bude broj
      map(id => Number(id))
    );
  }
}
