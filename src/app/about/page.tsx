"use client";

import { useI18n } from "@/shared/i18n/useI18n";

const AboutPage = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-dark">
      <section className="relative">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000&auto=format&fit=crop"
        >
          <source src="https://cdn.coverr.co/videos/coverr-luxury-car-9270/1080p.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
        <div className="relative z-10 container mx-auto px-6 pt-28 pb-16">
          <p className="text-xs uppercase tracking-[0.4em] text-muted">NovaDrive</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight lg:text-5xl">{t("about.title")}</h1>
          <p className="mt-4 max-w-2xl text-sm text-white/70">{t("about.subtitle")}</p>
        </div>
      </section>

      <section className="container mx-auto grid gap-8 px-6 pb-24 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">{t("about.infoTitle")}</p>
            <p className="mt-3 text-sm text-white/70">{t("about.infoBody")}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">{t("about.valuesTitle")}</p>
            <p className="mt-3 text-sm text-white/70">{t("about.valuesBody")}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">{t("about.mapTitle")}</p>
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
              <iframe
                title="NovaDrive Bishkek"
                src="https://maps.google.com/maps?q=AutoPark%20Rent%20a%20car%20Bishkek%20109%2F1%20Turusbekova%20street&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="h-72 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="mt-4 text-sm text-white/70">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">{t("about.mapAddressTitle")}</p>
              <p className="mt-2">{t("about.mapAddress")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
