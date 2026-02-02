export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface WorkingWindow {
  start: string; // "09:00"
  end: string;   // "18:00"
}

export type WeeklySchedule = Record<Weekday, WorkingWindow | null>;
