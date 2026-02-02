"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { fetchBookings, fetchServices, fetchSpecialists } from "@/shared/api/mock-client";
import { useBookingWizardStore } from "@/features/create-booking/model/store";
import { generateTimeSlots } from "@/entities/timeSlot/lib/generateTimeSlots";
import { useSlotLockStore } from "@/features/lock-slot/model/store";
import { useLockSlot } from "@/features/lock-slot/model/useLockSlot";
import { Button } from "@/shared/ui/Button";
import { useI18n } from "@/shared/i18n/useI18n";

export const SpecialistSchedule = () => {
  const { t } = useI18n();
  const { data: services } = useQuery({ queryKey: ["services"], queryFn: fetchServices });
  const { data: specialists } = useQuery({ queryKey: ["specialists"], queryFn: fetchSpecialists });
  const { data: bookings } = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
    refetchInterval: 10_000,
  });

  const serviceId = useBookingWizardStore((state) => state.serviceId);
  const specialistId = useBookingWizardStore((state) => state.specialistId);
  const date = useBookingWizardStore((state) => state.date);
  const selectSpecialist = useBookingWizardStore((state) => state.selectSpecialist);
  const selectDate = useBookingWizardStore((state) => state.selectDate);
  const selectTimeSlot = useBookingWizardStore((state) => state.selectTimeSlot);
  const lockedSlots = useSlotLockStore((state) => state.locks);

  const [error, setError] = useState<string | null>(null);
  const { lockSlot, releaseSlot, isLocking } = useLockSlot();

  const selectedService = services?.find((service) => service.id === serviceId);
  const selectedSpecialist = specialists?.find((specialist) => specialist.id === specialistId);
  const selectedDate = date ? new Date(date) : new Date();

  const specialistOptions = useMemo(() => {
    if (!serviceId) return specialists ?? [];
    return (specialists ?? []).filter((specialist) => specialist.serviceIds.includes(serviceId));
  }, [serviceId, specialists]);

  const slots = useMemo(() => {
    if (!selectedService || !selectedSpecialist || !bookings) return [];
    return generateTimeSlots({
      date: selectedDate,
      service: selectedService,
      specialist: selectedSpecialist,
      bookings,
      lockedSlotIds: Object.keys(lockedSlots),
    });
  }, [selectedService, selectedSpecialist, bookings, lockedSlots, selectedDate]);

  const getRemaining = (slotId: string) => {
    const lock = lockedSlots[slotId];
    if (!lock) return null;
    const seconds = Math.max(0, Math.floor((lock.expiresAt - Date.now()) / 1000));
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const handleSelectSlot = async (slotId: string, startTime: string, endTime: string) => {
    setError(null);
    try {
      await lockSlot({ slotId, specialistId: selectedSpecialist!.id, startTime, endTime });
      selectTimeSlot({ timeSlotId: slotId, startTime, endTime });
    } catch (err) {
      setError("Slot is locked by another user or already booked.");
    }
  };

  const handleRelease = async (slotId: string) => {
    await releaseSlot(slotId);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">{t("booking.step2")}</p>
          <h3 className="mt-2 text-xl font-semibold">{t("booking.chooseSpecialist")}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {specialistOptions.map((specialist) => (
              <button
                key={specialist.id}
                onClick={() => selectSpecialist(specialist.id)}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  specialistId === specialist.id
                    ? "border-primary/60 bg-primary/10"
                    : "border-white/10 bg-white/5 hover:border-primary/40"
                }`}
              >
                <p className="text-sm font-semibold">{specialist.name}</p>
                <p className="text-xs text-white/60">{specialist.specialization}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">{t("booking.dateLabel")}</p>
          <h3 className="mt-2 text-xl font-semibold">{t("booking.pickDay")}</h3>
          <input
            type="date"
            value={format(selectedDate, "yyyy-MM-dd")}
            onChange={(event) => selectDate(event.target.value)}
            className="mt-4 w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white"
          />
          <p className="mt-3 text-xs text-white/60">{t("booking.refreshHint")}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">{t("booking.step3")}</p>
            <h3 className="mt-2 text-xl font-semibold">{t("booking.slots")}</h3>
          </div>
          {error ? <span className="text-xs text-red-400">{error}</span> : null}
        </div>
        <p className="mt-2 text-xs text-white/60">{t("booking.slotHint")}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {slots.map((slot) => {
            const timeLabel = format(new Date(slot.startTime), "HH:mm");
            const isLocked = slot.status === "locked";
            const isBooked = slot.status === "booked";
            const countdown = getRemaining(slot.id);
            return (
              <button
                key={slot.id}
                disabled={isLocked || isBooked || isLocking}
                onClick={() => handleSelectSlot(slot.id, slot.startTime, slot.endTime)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  isBooked
                    ? "border-white/10 bg-white/5 text-white/30"
                    : isLocked
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-white/20 bg-transparent hover:border-primary/60 hover:bg-primary/10"
                }`}
              >
                {timeLabel}
                {countdown ? <span className="ml-2 text-[10px] text-white/50">{countdown}</span> : null}
              </button>
            );
          })}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => specialistId && selectSpecialist(specialistId)}>
            {t("booking.refreshSelection")}
          </Button>
          {Object.keys(lockedSlots).length > 0 ? (
            <Button
              variant="ghost"
              onClick={() => handleRelease(Object.keys(lockedSlots)[0])}
            >
              {t("booking.releaseLock")}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
