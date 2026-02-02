import { User } from "@/entities/user/model/types";

export type BookingStatus = "active" | "cancelled" | "completed";

export interface Booking {
  id: string;
  serviceId: string;
  specialistId: string;
  timeSlotId: string;
  client: User;
  status: BookingStatus;
  createdAt: string; // ISO дата
  price?: number;
  startTime?: string;
  endTime?: string;
}