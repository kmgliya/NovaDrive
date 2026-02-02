export type TimeSlotStatus = "free" | "locked" | "booked";

export interface TimeSlot {
  id: string;
  specialistId: string;
  startTime: string; // ISO дата
  endTime: string;   // ISO дата
  status: TimeSlotStatus;
}
