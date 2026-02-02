"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { fetchServices, fetchSpecialists } from "@/shared/api/mock-client";
import { useBookingWizardStore } from "@/features/create-booking/model/store";
import { useCreateBooking } from "@/features/create-booking/model/useCreateBooking";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { useI18n } from "@/shared/i18n/useI18n";

export const BookingSummary = () => {
  const { t } = useI18n();
  const { data: services } = useQuery({ queryKey: ["services"], queryFn: fetchServices });
  const { data: specialists } = useQuery({ queryKey: ["specialists"], queryFn: fetchSpecialists });
  const { serviceId, specialistId, startTime, endTime, timeSlotId, reset } = useBookingWizardStore();
  const createBooking = useCreateBooking();
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const selectedService = useMemo(() => services?.find((service) => service.id === serviceId), [services, serviceId]);
  const selectedSpecialist = useMemo(
    () => specialists?.find((specialist) => specialist.id === specialistId),
    [specialists, specialistId]
  );

  if (!serviceId || !specialistId || !startTime || !endTime || !timeSlotId) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">{t("booking.step4")}</p>
        <h3 className="mt-2 text-xl font-semibold">{t("summary.title")}</h3>
        <p className="mt-3 text-sm text-white/70">{t("summary.missing")}</p>
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-muted">{t("summary.card.title")}</p>
          <p className="mt-2 text-xs text-white/50">{t("summary.card.locked")}</p>
        </div>
      </div>
    );
  }

  const formattedDate = format(new Date(startTime), "PPP");
  const formattedTime = `${format(new Date(startTime), "HH:mm")} - ${format(new Date(endTime), "HH:mm")}`;
  const total = selectedService?.price ?? 0;

  const digitsOnly = (value: string) => value.replace(/\D/g, "");

  const formatCardNumber = (value: string) => {
    const digits = digitsOnly(value).slice(0, 19);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  };

  const formatExpiry = (value: string) => {
    const digits = digitsOnly(value).slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const cardNumberDigits = digitsOnly(cardNumber);
  const expiryDigits = digitsOnly(cardExpiry);
  const cvcDigits = digitsOnly(cardCvc);
  const isPaymentValid =
    cardNumberDigits.length > 0 && cardName.trim().length > 0 && expiryDigits.length > 0 && cvcDigits.length > 0;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <p className="text-xs uppercase tracking-[0.3em] text-muted">{t("booking.step4")}</p>
      <h3 className="mt-2 text-xl font-semibold">{t("summary.title")}</h3>

      <div className="mt-4 space-y-3 text-sm text-white/70">
        <div className="flex items-center justify-between">
          <span>{t("summary.service")}</span>
          <span className="text-white">{selectedService?.title ?? "—"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>{t("summary.specialist")}</span>
          <span className="text-white">{selectedSpecialist?.name ?? "—"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>{t("summary.date")}</span>
          <span className="text-white">{formattedDate}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>{t("summary.time")}</span>
          <span className="text-white">{formattedTime}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>{t("summary.total")}</span>
          <span className="text-white">${total}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          onClick={() =>
            createBooking.mutate({
              serviceId,
              specialistId,
              timeSlotId,
              startTime,
              endTime,
              price: total,
            })
          }
          disabled={createBooking.isPending || !isPaymentValid}
          className="flex-1"
        >
          {createBooking.isPending ? t("summary.processing") : t("summary.confirm")}
        </Button>
        <Button variant="outline" onClick={reset}>
          {t("summary.reset")}
        </Button>
      </div>
      {createBooking.error ? (
        <p className="mt-3 text-xs text-red-400">{t("summary.failed")}</p>
      ) : null}

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-[0.25em] text-muted">{t("summary.card.title")}</p>
        <div className="mt-3 grid gap-3">
          <Input
            label={t("summary.card.number")}
            placeholder="4242 4242 4242 4242"
            inputMode="numeric"
            value={cardNumber}
            onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
            maxLength={19}
          />
          <Input
            label={t("summary.card.name")}
            placeholder="Alex Morgan"
            value={cardName}
            onChange={(event) => setCardName(event.target.value.replace(/[^a-zA-ZА-Яа-яЁё\s]/g, ""))}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label={t("summary.card.expiry")}
              placeholder="MM/YY"
              inputMode="numeric"
              value={cardExpiry}
              onChange={(event) => setCardExpiry(formatExpiry(event.target.value))}
              maxLength={5}
            />
            <Input
              label={t("summary.card.cvc")}
              placeholder="123"
              inputMode="numeric"
              value={cardCvc}
              onChange={(event) => setCardCvc(digitsOnly(event.target.value).slice(0, 4))}
              maxLength={4}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-white/50">
            <span>{t("summary.card.note")}</span>
            <span>{t("summary.total")}: ${total}</span>
          </div>
          {!isPaymentValid ? (
            <p className="text-[11px] text-red-400">{t("summary.card.error")}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};
