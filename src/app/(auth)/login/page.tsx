"use client";

import { LoginForm } from "@/features/auth/ui/LoginForm";
import { useI18n } from "@/shared/i18n/useI18n";

export default function LoginPage() {
  const { t } = useI18n();

  return (
    <div className="relative min-h-[calc(100vh-5rem)] bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
      <div className="relative z-10 container mx-auto grid items-center gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-xl space-y-6">
          <p className="text-xs uppercase tracking-[0.4em] text-muted">NovaDrive</p>
          <h1 className="text-4xl font-semibold leading-tight lg:text-5xl">
            {t("auth.hero.login.title")}
          </h1>
          <p className="text-sm text-white/70">
            {t("auth.hero.login.subtitle")}
          </p>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.25em] text-white/50">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">{t("auth.hero.badge.fast")}</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">{t("auth.hero.badge.support")}</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">{t("auth.hero.badge.trusted")}</span>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}