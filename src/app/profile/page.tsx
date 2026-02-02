"use client";

import { getCurrentUser } from "@/shared/api/current-user";
import { UserBookings } from "@/widgets/user-bookings/ui/UserBookings";
import { useI18n } from "@/shared/i18n/useI18n";

const ProfilePage = () => {
  const user = getCurrentUser();
  const { t } = useI18n();

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-dark">
      <div className="container mx-auto px-6 py-16">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">{t("profile.title")}</p>
            <h1 className="mt-3 text-3xl font-semibold">{user.name}</h1>
            <p className="mt-2 text-sm text-white/70">{t("profile.member")}</p>

            <div className="mt-6 space-y-4 text-sm text-white/70">
              <div className="flex items-center justify-between">
                <span>{t("profile.email")}</span>
                <span className="text-white">{user.email ?? "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t("profile.phone")}</span>
                <span className="text-white">{user.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t("profile.status")}</span>
                <span className="text-primary">{t("profile.statusActive")}</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">{t("profile.bookings")}</p>
            <h2 className="mt-3 text-2xl font-semibold">{t("profile.manageTitle")}</h2>
            <p className="mt-3 text-sm text-white/70">{t("profile.manageSubtitle")}</p>
          </div>
        </div>

        <div className="mt-8">
          <UserBookings />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
