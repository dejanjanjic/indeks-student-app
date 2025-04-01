import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Schedule } from '../model/schedule.model';
import { Observable } from 'rxjs';
import { ScheduleItem } from '../model/scheduleItem.model';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private scheduleUrl = 'http://localhost:8080/api/v1/schedule';
  private scheduleItemUrl = 'http://localhost:8080/api/v1/scheduleItem';
  constructor(private http: HttpClient) {}

  getScheduleData(studentId: number): Observable<ScheduleItem[]> {
    return this.http.get<ScheduleItem[]>(
      `${this.scheduleUrl}/${studentId}/items`
    );
  }

  updateScheduleData(scheduleItemId: number, data: any): Observable<any> {
    return this.http.put(`${this.scheduleItemUrl}/${scheduleItemId}`, data);
  }
}
