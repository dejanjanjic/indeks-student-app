import { Schedule } from './schedule.model';

export interface ScheduleItem {
  id: number;
  day: number;
  time: string;
  content: string;
  schedule: string;
}
