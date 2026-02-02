"use client";

import { ServiceSelector } from "@/widgets/service-selector/ui/ServiceSelector";
import { SpecialistSchedule } from "@/widgets/specialist-schedule/ui/SpecialistSchedule";
import { BookingSummary } from "@/widgets/booking-summary/ui/BookingSummary";
import { useBookingWizardStore } from "@/features/create-booking/model/store";
import { useI18n } from "@/shared/i18n/useI18n";

const BookingPage = () => {
  const step = useBookingWizardStore((state) => state.step);
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-dark">
      <section className="container mx-auto px-6 pt-24 pb-10">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/0 to-primary/10 p-10 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.4em] text-muted">{t("booking.tag")}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight lg:text-5xl">
            {t("booking.title")}
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-white/70">
            {t("booking.subtitle")}
          </p>
        </div>
      </section>

      <section className="container mx-auto grid gap-8 px-6 pb-24 lg:grid-cols-[1.6fr_0.8fr]">
        <div className="space-y-10">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">{t("booking.step1")}</p>
            <h2 className="mt-2 text-xl font-semibold">{t("booking.selectService")}</h2>
            <div className="mt-4">
              <ServiceSelector />
            </div>
          </div>

          {step >= 2 ? <SpecialistSchedule /> : null}
        </div>

        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <BookingSummary />
        </div>
      </section>
    </div>
  );
};

export default BookingPage;
