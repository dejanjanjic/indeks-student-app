import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Schedule } from '../model/schedule.model';
import { Observable } from 'rxjs';
import { ScheduleItem } from '../model/scheduleItem.model';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private apiUrl = 'http://localhost:8080/api/v1/schedule';
  constructor(private http: HttpClient) {}

  getScheduleData(studentId: number): Observable<ScheduleItem[]> {
    return this.http.get<ScheduleItem[]>(`${this.apiUrl}/${studentId}/items`, {
      headers: { Accept: 'application/json' },
    });
  }
}
