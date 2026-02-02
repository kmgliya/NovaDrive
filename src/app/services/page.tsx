"use client";

import Link from "next/link";
import { ServiceSelector } from "@/widgets/service-selector/ui/ServiceSelector";
import { Button } from "@/shared/ui/Button";
import { useI18n } from "@/shared/i18n/useI18n";

const ServicesPage = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-dark">
      <section className="container mx-auto px-6 pt-24 pb-10">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/0 to-primary/10 p-10 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.4em] text-muted">{t("services.tag")}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight lg:text-5xl">
            {t("services.title")}
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-white/70">
            {t("services.subtitle")}
          </p>
          <div className="mt-6">
            <Link href="/booking">
              <Button className="px-6 py-3">{t("services.cta")}</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-24">
        <ServiceSelector redirectOnSelect />
      </section>
    </div>
  );
};

export default ServicesPage;
