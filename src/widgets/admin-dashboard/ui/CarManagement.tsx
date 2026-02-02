"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchCars } from "@/shared/api/mock-client";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { useI18n } from "@/shared/i18n/useI18n";

export const CarManagement = () => {
  const { t } = useI18n();
  const { data: cars } = useQuery({
    queryKey: ["cars"],
    queryFn: fetchCars,
  });

  return (
    <section id="fleet" className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted">{t("admin.fleet")}</p>
        <h3 className="mt-2 text-2xl font-semibold">{t("admin.carManagement")}</h3>
        <p className="mt-2 text-sm text-white/70">{t("admin.carDesc")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {cars?.map((car) => (
          <div key={car.id} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex gap-5">
              <div className="relative h-28 w-40 overflow-hidden rounded-2xl border border-white/10">
                <Image src={car.image} alt={car.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.3em] text-muted">{car.brand}</p>
                <h4 className="mt-1 text-lg font-semibold">{car.name}</h4>
                <p className="mt-2 text-sm text-white/70">${car.pricePerHour}/hour · {car.category}</p>
                <p className="mt-1 text-xs text-white/50">
                  {car.workingHours.start} - {car.workingHours.end} · {t("catalog.buffer")} {car.bufferTime} min
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Input label={t("admin.label.name")} defaultValue={car.name} />
              <Input label={t("admin.label.image")} defaultValue={car.image} />
              <Input label={t("admin.label.price")} defaultValue={car.pricePerHour} type="number" />
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <Button className="rounded-full px-5 py-2 text-xs">{t("admin.btn.save")}</Button>
              <Button variant="outline" className="rounded-full px-5 py-2 text-xs">{t("admin.btn.archive")}</Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
