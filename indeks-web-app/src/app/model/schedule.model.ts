import { ScheduleItem } from './scheduleItem.model';

export interface Schedule {
  id: number;
  scheduleItems?: ScheduleItem[];
}
export interface UpdateSchedulePayload {
  id: number;
  num: string;
}
