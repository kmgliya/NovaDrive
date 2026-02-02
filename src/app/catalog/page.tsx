"use client";

import { CatalogGrid } from "@/widgets/catalog/ui/CatalogGrid";
import { useI18n } from "@/shared/i18n/useI18n";

const CatalogPage = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-dark">
      <section className="container mx-auto px-6 pt-24 pb-12">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/0 to-primary/10 p-10 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.4em] text-muted">{t("catalog.tag")}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight lg:text-5xl">
            {t("catalog.title")}
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-white/70">
            {t("catalog.subtitle")}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-24">
        <CatalogGrid />
      </section>
    </div>
  );
};

export default CatalogPage;
