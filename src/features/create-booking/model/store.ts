import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BookingStep = 1 | 2 | 3 | 4;

type BookingWizardState = {
  step: BookingStep;
  serviceId?: string;
  specialistId?: string;
  date?: string; // ISO date string
  timeSlotId?: string;
  startTime?: string;
  endTime?: string;
  setStep: (step: BookingStep) => void;
  selectService: (serviceId: string) => void;
  selectSpecialist: (specialistId: string) => void;
  selectDate: (date: string) => void;
  selectTimeSlot: (payload: { timeSlotId: string; startTime: string; endTime: string }) => void;
  reset: () => void;
};

const initialState = {
  step: 1 as BookingStep,
};

export const useBookingWizardStore = create<BookingWizardState>()(
  persist(
    (set) => ({
      ...initialState,
      setStep: (step) => set({ step }),
      selectService: (serviceId) =>
        set({
          serviceId,
          specialistId: undefined,
          date: undefined,
          timeSlotId: undefined,
          startTime: undefined,
          endTime: undefined,
          step: 2,
        }),
      selectSpecialist: (specialistId) =>
        set({
          specialistId,
          date: undefined,
          timeSlotId: undefined,
          startTime: undefined,
          endTime: undefined,
          step: 3,
        }),
      selectDate: (date) =>
        set({
          date,
          timeSlotId: undefined,
          startTime: undefined,
          endTime: undefined,
        }),
      selectTimeSlot: ({ timeSlotId, startTime, endTime }) =>
        set({
          timeSlotId,
          startTime,
          endTime,
          step: 4,
        }),
      reset: () => set({ ...initialState }),
    }),
    { name: "novadrive-booking-wizard" }
  )
);
