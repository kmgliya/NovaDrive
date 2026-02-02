"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/Button";
import { useI18n } from "@/shared/i18n/useI18n";

export default function Home() {
  const { t } = useI18n();

  return (
    <main className="min-h-screen bg-dark">
      <section className="relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
        <div className="relative z-10 container mx-auto px-6 pt-32 pb-24">
          <p className="text-xs uppercase tracking-[0.4em] text-muted">{t("home.tag")}</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-tight lg:text-6xl">
            {t("home.title")}
          </h1>
          <p className="mt-6 max-w-2xl text-sm text-white/70">
            {t("home.subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/booking">
              <Button className="px-7 py-3">{t("home.cta.booking")}</Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" className="px-7 py-3">
                {t("home.cta.services")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}