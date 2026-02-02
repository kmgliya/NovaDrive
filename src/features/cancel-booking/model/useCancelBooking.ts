"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelBooking } from "@/shared/api/mock-client";
import { Booking } from "@/entities/booking/model/types";

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => cancelBooking(bookingId),
    onMutate: async (bookingId) => {
      await queryClient.cancelQueries({ queryKey: ["bookings"] });
      const previous = queryClient.getQueryData<Booking[]>(["bookings"]) ?? [];
      queryClient.setQueryData<Booking[]>(
        ["bookings"],
        previous.map((booking) =>
          booking.id === bookingId ? { ...booking, status: "cancelled" } : booking
        )
      );
      return { previous };
    },
    onError: (_err, _bookingId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["bookings"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};
