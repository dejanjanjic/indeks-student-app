import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReportedAccount } from '../model/reported-types.model';
import { ReportedComment } from '../model/reported-types.model';
import { ReportedMaterial } from '../model/reported-types.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportProblemService {
  private BASE_URL_GET = 'http://localhost:8080/api/v1/problemReport/type/';
  private BASE_URL_DELETE = 'http://localhost:8080/api/v1/problemReport';
  constructor(private http: HttpClient) {}

  getReportedMaterials(): Observable<ReportedMaterial[]> {
    return this.http.get<ReportedMaterial[]>(`${this.BASE_URL_GET}1`);
  }

  getReportedComments(): Observable<ReportedComment[]> {
    return this.http.get<ReportedComment[]>(`${this.BASE_URL_GET}0`);
  }

  getReportedAccounts(): Observable<ReportedAccount[]> {
    return this.http.get<ReportedAccount[]>(`${this.BASE_URL_GET}2`);
  }
  deleteReportedProblem(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL_DELETE}/${id}`);
  }
}
