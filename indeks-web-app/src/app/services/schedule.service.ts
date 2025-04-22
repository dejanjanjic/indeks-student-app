import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ScheduleItem } from '../model/scheduleItem.model';
import { UpdateSchedulePayload } from '../model/schedule.model';

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

  createScheduleItem(data: Partial<ScheduleItem>): Observable<ScheduleItem> {
    return this.http.post<ScheduleItem>(this.scheduleItemUrl, data);
  }

  updateScheduleItem(
    scheduleItemId: number,
    data: Partial<ScheduleItem>
  ): Observable<any> {
    return this.http.put(`${this.scheduleItemUrl}/${scheduleItemId}`, data);
  }

  updateScheduleGroup(payload: UpdateSchedulePayload): Observable<any> {
    return this.http.put(`${this.scheduleUrl}`, payload);
  }
}
