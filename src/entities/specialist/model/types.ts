import { WeeklySchedule } from "@/entities/schedule/model/types";

export interface Specialist {
  id: string;
  name: string;
  specialization: string;
  avatar: string;
  workingHours: WeeklySchedule;
  serviceIds: string[];
}
