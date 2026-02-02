"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rescheduleBooking } from "@/shared/api/mock-client";
import { Booking } from "@/entities/booking/model/types";

export const useRescheduleBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { bookingId: string; timeSlotId: string; startTime: string; endTime: string }) =>
      rescheduleBooking(payload.bookingId, {
        timeSlotId: payload.timeSlotId,
        startTime: payload.startTime,
        endTime: payload.endTime,
      }),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["bookings"] });
      const previous = queryClient.getQueryData<Booking[]>(["bookings"]) ?? [];
      queryClient.setQueryData<Booking[]>(
        ["bookings"],
        previous.map((booking) =>
          booking.id === payload.bookingId
            ? { ...booking, timeSlotId: payload.timeSlotId, startTime: payload.startTime, endTime: payload.endTime }
            : booking
        )
      );
      return { previous };
    },
    onError: (_err, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["bookings"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};
