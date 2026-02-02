import { addMinutes, differenceInMinutes, format, parseISO } from "date-fns";
import { Booking } from "@/entities/booking/model/types";
import { Service } from "@/entities/service/model/types";
import { Specialist } from "@/entities/specialist/model/types";
import { TimeSlot } from "@/entities/timeSlot/model/types";

const buildDate = (date: Date, time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const withTime = new Date(date);
  withTime.setHours(hours, minutes, 0, 0);
  return withTime;
};

const overlaps = (startA: Date, endA: Date, startB: Date, endB: Date) => {
  return startA < endB && endA > startB;
};

export const generateTimeSlots = (params: {
  date: Date;
  service: Service;
  specialist: Specialist;
  bookings: Booking[];
  lockedSlotIds?: string[];
}) => {
  const { date, service, specialist, bookings, lockedSlotIds = [] } = params;
  const weekday = date.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
  const workingWindow = specialist.workingHours[weekday];

  if (!workingWindow) return [];

  const start = buildDate(date, workingWindow.start);
  const end = buildDate(date, workingWindow.end);

  const slots: TimeSlot[] = [];
  const availableMinutes = differenceInMinutes(end, start) - service.durationMins;
  if (availableMinutes < 0) return slots;

  const targetCount = availableMinutes >= service.durationMins * 2 ? 3 : 2;
  const interval = targetCount === 1 ? 0 : Math.floor(availableMinutes / (targetCount - 1));

  const roundToQuarter = (value: Date) => {
    const minutes = value.getMinutes();
    const rounded = Math.round(minutes / 15) * 15;
    const next = new Date(value);
    next.setMinutes(rounded, 0, 0);
    return next;
  };

  const candidates = Array.from({ length: targetCount }, (_, index) => {
    const candidate = addMinutes(start, interval * index);
    return roundToQuarter(candidate);
  });

  candidates.forEach((slotStart) => {
    const slotEnd = addMinutes(slotStart, service.durationMins);
    if (slotEnd > end) return;
    const slotId = `slot-${format(date, "yyyy-MM-dd")}-${format(slotStart, "HH-mm")}`;

    const bufferedStart = addMinutes(slotStart, -service.bufferBeforeMins);
    const bufferedEnd = addMinutes(slotEnd, service.bufferAfterMins);

    const hasConflict = bookings.some((booking) => {
      if (booking.specialistId !== specialist.id) return false;
      if (booking.status === "cancelled") return false;
      if (!booking.startTime || !booking.endTime) return false;
      const bookedStart = parseISO(booking.startTime);
      const bookedEnd = parseISO(booking.endTime);
      return overlaps(bufferedStart, bufferedEnd, bookedStart, bookedEnd);
    });

    slots.push({
      id: slotId,
      specialistId: specialist.id,
      startTime: slotStart.toISOString(),
      endTime: slotEnd.toISOString(),
      status: hasConflict ? "booked" : lockedSlotIds.includes(slotId) ? "locked" : "free",
    });
  });

  return slots;
};
