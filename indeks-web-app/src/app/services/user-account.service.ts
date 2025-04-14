import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserAccountService {
  private BASE_URL = 'http://localhost:8080/api/v1/userAccount';

  constructor(private http: HttpClient) {}

  getUserAccountsDetails(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/details`);
  }
  getByKeyword(keyword: string) {
    return this.http.get<any>(
      `${this.BASE_URL}/details/search?keyword=${keyword}`
    );
  }
  updateSuspension(id: number) {
    return this.http.post<any>(`${this.BASE_URL}/${id}/suspend`, null);
  }

  getUserById(userAccountId: number): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/${userAccountId}`);
  }
}
