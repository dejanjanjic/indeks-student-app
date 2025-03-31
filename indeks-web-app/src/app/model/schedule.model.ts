import { ScheduleItem } from './scheduleItem.model';

export interface Schedule {
  id: number;
  scheduleItems?: ScheduleItem[];
}
