"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchServices } from "@/shared/api/mock-client";
import { useBookingWizardStore } from "@/features/create-booking/model/store";
import { Button } from "@/shared/ui/Button";
import { useI18n } from "@/shared/i18n/useI18n";

type ServiceSelectorProps = {
  redirectOnSelect?: boolean;
};

export const ServiceSelector = ({ redirectOnSelect = false }: ServiceSelectorProps) => {
  const router = useRouter();
  const { t } = useI18n();
  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });
  const selectedServiceId = useBookingWizardStore((state) => state.serviceId);
  const selectService = useBookingWizardStore((state) => state.selectService);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {services?.map((service) => {
        const active = service.id === selectedServiceId;
        return (
          <div
            key={service.id}
            className={`overflow-hidden rounded-3xl border backdrop-blur transition ${
              active ? "border-primary/60 bg-primary/10" : "border-white/10 bg-white/5 hover:border-primary/30"
            }`}
          >
            <div className="relative h-36 w-full">
              <Image src={service.image} alt={service.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
            </div>
            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">{t("service.card.label")}</p>
              <h3 className="mt-2 text-xl font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm text-white/70">
                {service.durationMins} min · ${service.price}
              </p>
              <p className="mt-2 text-xs text-white/50">
                {t("service.card.buffer")} {service.bufferBeforeMins}m {t("service.card.before")} /{" "}
                {service.bufferAfterMins}m {t("service.card.after")}
              </p>
              <Button
                onClick={() => {
                  selectService(service.id);
                  if (redirectOnSelect) {
                    router.push("/booking");
                  }
                }}
                className="mt-5 w-full"
              >
                {active ? t("service.card.selected") : t("service.card.select")}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
