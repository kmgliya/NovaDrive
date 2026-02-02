"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchCars } from "@/shared/api/mock-client";
import { Button } from "@/shared/ui/Button";
import { useI18n } from "@/shared/i18n/useI18n";

export const CatalogGrid = () => {
  const { t } = useI18n();
  const { data: cars } = useQuery({
    queryKey: ["cars"],
    queryFn: fetchCars,
  });

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {cars?.map((car) => (
        <div
          key={car.id}
          className="group rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6 backdrop-blur transition hover:border-primary/40 hover:shadow-[0_0_40px_rgba(255,95,0,0.15)]"
        >
          <div className="relative h-44 w-full overflow-hidden rounded-2xl border border-white/10">
            <Image src={car.image} alt={car.name} fill className="object-cover transition duration-300 group-hover:scale-105" />
          </div>
          <div className="mt-5">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">{car.brand}</p>
            <h3 className="mt-2 text-xl font-semibold">{car.name}</h3>
            <p className="mt-2 text-sm text-white/70">
              {car.workingHours.start} - {car.workingHours.end} · {t("catalog.buffer")} {car.bufferTime} min
            </p>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-lg font-semibold">${car.pricePerHour}/hour</p>
              <Link href="/booking">
                <Button className="rounded-full px-4 py-2 text-xs">{t("catalog.book")}</Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
