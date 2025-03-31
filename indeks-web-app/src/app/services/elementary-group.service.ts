import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ElementaryGroup } from '../model/elementary-group.model';

@Injectable({
  providedIn: 'root',
})
export class ElementaryGroupService {
  private BASE_URL = 'http://localhost:8080/api/v1/elementaryGroup';
  constructor(private http: HttpClient) {}

  public getAllInfo(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/info`);
  }

  getByKeyword(keyword: string) {
    return this.http.get(`${this.BASE_URL}/filter/${keyword}`);
  }

  public add(elementaryGroup: ElementaryGroup) {
    return this.http.post(this.BASE_URL, elementaryGroup);
  }

  public deleteById(id: number) {
    return this.http.delete(`${this.BASE_URL}/${id}`);
  }
}
