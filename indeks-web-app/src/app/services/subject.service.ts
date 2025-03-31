// services/subject.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject } from '../model/subject.model';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private apiUrl = 'http://localhost:8080/api/v1/subject';

  constructor(private http: HttpClient) { }

  getSubjectsByYear(year: number): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.apiUrl}/year/${year}`);
  }
}
