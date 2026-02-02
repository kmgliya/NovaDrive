"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createBooking } from "@/shared/api/mock-client";
import { Booking } from "@/entities/booking/model/types";
import { getCurrentUser } from "@/shared/api/current-user";
import { useBookingWizardStore } from "@/features/create-booking/model/store";
import { useSlotLockStore } from "@/features/lock-slot/model/store";

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const resetWizard = useBookingWizardStore((state) => state.reset);
  const releaseSlot = useSlotLockStore((state) => state.releaseSlot);
  const currentUser = getCurrentUser();

  return useMutation({
    mutationFn: (payload: {
      serviceId: string;
      specialistId: string;
      timeSlotId: string;
      startTime: string;
      endTime: string;
      price?: number;
    }) =>
      createBooking({
        ...payload,
        client: currentUser,
      }),
    onSuccess: (booking) => {
      queryClient.setQueryData<Booking[]>(["bookings"], (prev = []) => [booking, ...prev]);
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      releaseSlot(booking.timeSlotId);
      resetWizard();
      router.push("/profile");
    },
  });
};
