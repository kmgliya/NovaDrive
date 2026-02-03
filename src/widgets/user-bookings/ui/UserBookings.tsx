"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { addMinutes, format } from "date-fns";
import { fetchBookings, fetchServices, fetchSpecialists } from "@/shared/api/mock-client";
import { useCancelBooking } from "@/features/cancel-booking/model/useCancelBooking";
import { useRescheduleBooking } from "@/features/reschedule-booking/model/useRescheduleBooking";
import { Button } from "@/shared/ui/Button";
import { getCurrentUser } from "@/shared/api/current-user";
import { useI18n } from "@/shared/i18n/useI18n";
import { generateTimeSlots } from "@/entities/timeSlot/lib/generateTimeSlots";
import { useSlotLockStore } from "@/features/lock-slot/model/store";
import { useLockSlot } from "@/features/lock-slot/model/useLockSlot";

export const UserBookings = () => {
  const { t } = useI18n();
  const { data: bookings } = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
    refetchInterval: 12_000,
  });
  const { data: services } = useQuery({ queryKey: ["services"], queryFn: fetchServices });
  const { data: specialists } = useQuery({ queryKey: ["specialists"], queryFn: fetchSpecialists });
  const cancelBooking = useCancelBooking();
  const rescheduleBooking = useRescheduleBooking();
  const lockedSlots = useSlotLockStore((state) => state.locks);
  const { lockSlot, releaseSlot } = useLockSlot();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<{
    id: string;
    startTime: string;
    endTime: string;
  } | null>(null);
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);

  const currentUser = getCurrentUser();
  const userBookings = (bookings ?? []).filter((booking) => {
    const client = booking.client;
    if (!client) return false;
    if (client.id && client.id === currentUser.id) return true;
    if (client.email && currentUser.email && client.email === currentUser.email) return true;
    if (client.name && client.name.toLowerCase() === currentUser.name.toLowerCase()) return true;
    return false;
  });

  const getService = (serviceId: string) => services?.find((service) => service.id === serviceId);
  const getSpecialist = (specialistId: string) => specialists?.find((spec) => spec.id === specialistId);

  const activeBookings = userBookings.filter((booking) => booking.status === "active");
  const pastBookings = userBookings.filter((booking) => booking.status !== "active");

  return (
    <div className="space-y-8">
      {userBookings.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-white/70">{t("bookings.empty")}</p>
        </div>
      ) : null}

      {activeBookings.length > 0 ? (
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">{t("bookings.active")}</p>
          {activeBookings.map((booking) => {
            const service = getService(booking.serviceId);
            const specialist = getSpecialist(booking.specialistId);
            const startTime = booking.startTime ? new Date(booking.startTime) : null;
            const endTime = booking.endTime ? new Date(booking.endTime) : null;
            const statusTag = "border-primary/50 text-primary bg-primary/10";

            return (
              <div key={booking.id} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-muted">{t("bookings.label")}</p>
                    <h3 className="mt-2 text-lg font-semibold">{service?.title ?? "Service"}</h3>
                    <p className="text-sm text-white/70">{specialist?.name ?? "Specialist"}</p>
                    <p className="mt-2 text-xs text-white/50">
                      {startTime ? format(startTime, "PPP HH:mm") : "—"} ·{" "}
                      {endTime ? format(endTime, "HH:mm") : "—"}
                    </p>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wide ${statusTag}`}>
                    {t("status.active")}
                  </span>
                </div>

                {editingId === booking.id ? (
                  <div className="mt-4 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="date"
                        value={rescheduleDate}
                        onChange={(event) => {
                          setRescheduleDate(event.target.value);
                          setSelectedSlot(null);
                          setRescheduleError(null);
                        }}
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white"
                      />
                      {rescheduleError ? (
                        <span className="text-xs text-red-400">{rescheduleError}</span>
                      ) : null}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      {(service && specialist && bookings
                        ? generateTimeSlots({
                            date: rescheduleDate
                              ? new Date(rescheduleDate)
                              : startTime ?? new Date(),
                            service,
                            specialist,
                            bookings: (bookings ?? []).filter((item) => item.id !== booking.id),
                            lockedSlotIds: Object.keys(lockedSlots),
                          })
                        : []
                      ).map((slot) => {
                        const timeLabel = format(new Date(slot.startTime), "HH:mm");
                        const isLocked = slot.status === "locked";
                        const isBooked = slot.status === "booked";
                        const isSelected = selectedSlot?.id === slot.id;

                        return (
                          <button
                            key={slot.id}
                            disabled={isLocked || isBooked}
                            onClick={async () => {
                              setRescheduleError(null);
                              try {
                                if (selectedSlot?.id && selectedSlot.id !== slot.id) {
                                  await releaseSlot(selectedSlot.id);
                                }
                                await lockSlot({
                                  slotId: slot.id,
                                  specialistId: specialist.id,
                                  startTime: slot.startTime,
                                  endTime: slot.endTime,
                                });
                                setSelectedSlot({
                                  id: slot.id,
                                  startTime: slot.startTime,
                                  endTime: slot.endTime,
                                });
                              } catch (err) {
                                setRescheduleError(t("summary.failed"));
                              }
                            }}
                            className={`rounded-full border px-4 py-2 text-sm transition ${
                              isBooked
                                ? "border-white/10 bg-white/5 text-white/30"
                                : isLocked
                                ? "border-primary/40 bg-primary/10 text-primary"
                                : isSelected
                                ? "border-primary/60 bg-primary/20 text-primary"
                                : "border-white/20 bg-transparent hover:border-primary/60 hover:bg-primary/10"
                            }`}
                          >
                            {timeLabel}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={() => {
                          if (!selectedSlot) return;
                          rescheduleBooking.mutate({
                            bookingId: booking.id,
                            timeSlotId: selectedSlot.id,
                            startTime: selectedSlot.startTime,
                            endTime: selectedSlot.endTime,
                          });
                          setEditingId(null);
                          setSelectedSlot(null);
                          setRescheduleDate("");
                        }}
                        className="px-4 py-2 text-xs"
                        disabled={!selectedSlot}
                      >
                        {t("bookings.apply")}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          if (selectedSlot?.id) {
                            releaseSlot(selectedSlot.id);
                          }
                          setEditingId(null);
                          setSelectedSlot(null);
                          setRescheduleDate("");
                        }}
                        className="px-4 py-2 text-xs"
                      >
                        {t("bookings.close")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button
                      onClick={() => {
                        setEditingId(booking.id);
                        setRescheduleDate(
                          startTime ? format(startTime, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")
                        );
                        setSelectedSlot(null);
                        setRescheduleError(null);
                      }}
                      className="px-4 py-2 text-xs"
                    >
                      {t("bookings.reschedule")}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => cancelBooking.mutate(booking.id)}
                      className="px-4 py-2 text-xs"
                    >
                      {t("bookings.cancel")}
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : null}

      {pastBookings.length > 0 ? (
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">{t("bookings.past")}</p>
          {pastBookings.map((booking) => {
            const service = getService(booking.serviceId);
            const specialist = getSpecialist(booking.specialistId);
            const startTime = booking.startTime ? new Date(booking.startTime) : null;
            const endTime = booking.endTime ? new Date(booking.endTime) : null;
            const statusTag =
              booking.status === "completed"
                ? "border-white/20 text-white/50 bg-white/5"
                : "border-red-400/40 text-red-300 bg-red-500/10";

            return (
              <div key={booking.id} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-muted">{t("bookings.label")}</p>
                    <h3 className="mt-2 text-lg font-semibold">{service?.title ?? "Service"}</h3>
                    <p className="text-sm text-white/70">{specialist?.name ?? "Specialist"}</p>
                    <p className="mt-2 text-xs text-white/50">
                      {startTime ? format(startTime, "PPP HH:mm") : "—"} ·{" "}
                      {endTime ? format(endTime, "HH:mm") : "—"}
                    </p>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wide ${statusTag}`}>
                    {t(`status.${booking.status}`)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
