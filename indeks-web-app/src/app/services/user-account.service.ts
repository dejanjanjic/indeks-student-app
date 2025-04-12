import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserAccountService {
  getByKeyword(keyword: string) {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://localhost:8080/api/v1/userAccount';

  constructor(private http: HttpClient) {}

  getUserAccountsDetails(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/details`);
  }
}
