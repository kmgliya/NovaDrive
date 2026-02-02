"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/shared/api/mock-client";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { useI18n } from "@/shared/i18n/useI18n";

export const UserManagement = () => {
  const { t } = useI18n();
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  return (
    <section id="users" className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted">{t("admin.nav.users")}</p>
        <h3 className="mt-2 text-2xl font-semibold">{t("admin.userTitle")}</h3>
        <p className="mt-2 text-sm text-white/70">{t("admin.userDesc")}</p>
      </div>

      <div className="grid gap-4">
        {users?.map((user) => (
          <div key={user.id} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/10">
                {user.avatar ? (
                  <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                ) : null}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-white/60">{user.email ?? user.phone}</p>
              </div>
              <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs uppercase tracking-wide text-primary">
                {user.role ?? "user"}
              </span>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
              <Input label={t("admin.label.name")} defaultValue={user.name} />
              <Input label={t("admin.label.avatar")} defaultValue={user.avatar} />
              <Button className="mt-6 h-[50px] rounded-full px-5 text-xs">{t("admin.btn.update")}</Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
