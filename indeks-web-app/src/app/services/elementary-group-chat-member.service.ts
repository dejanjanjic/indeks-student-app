import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ElementaryGroupChatMemberService {
  private BASE_URL = 'http://localhost:8080/api/v1/elementaryGroupChatMember';
  constructor(private http: HttpClient) {}

  getMembersByGroupId(groupId: number) {
    return this.http.get(`${this.BASE_URL}/${groupId}`);
  }
  deleteFromGroup(groupId: number, userAccountId: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${groupId}/${userAccountId}`);
  }
  getByKeyword(groupId: string, keyword: string) {
    return this.http.get(`${this.BASE_URL}/${groupId}/filter/${keyword}`);
  }
}
