import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ElementaryGroupService {
  private BASE_URL = 'http://localhost:8080/api/v1/elementaryGroup';
  constructor(private http: HttpClient) {}

  public getAllInfo(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/info`);
  }
}
