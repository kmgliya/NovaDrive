"use client";

import Link from "next/link";
import { LayoutGrid, Settings, Users } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useI18n } from "@/shared/i18n/useI18n";

type AdminShellProps = {
  children: React.ReactNode;
};

const navItems = [
  { labelKey: "admin.nav.dashboard", href: "/admin", icon: LayoutGrid },
  { labelKey: "admin.nav.fleet", href: "/admin#fleet", icon: Settings },
  { labelKey: "admin.nav.specialists", href: "/admin#specialists", icon: Users },
];

export const AdminShell = ({ children }: AdminShellProps) => {
  const { t } = useI18n();

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-dark">
      <div className="container mx-auto px-6 py-10 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="sticky top-28 h-fit rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">{t("admin.tag")}</p>
          <h1 className="mt-3 text-2xl font-semibold">{t("admin.title")}</h1>
          <nav className="mt-8 flex flex-col gap-2">
            {navItems.map(({ labelKey, href, icon: Icon }) => (
              <Link
                key={labelKey}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  "border border-white/5 bg-white/0 hover:bg-white/10 hover:border-white/15"
                )}
              >
                <Icon className="h-4 w-4 text-primary" />
                {t(labelKey)}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="space-y-10">{children}</section>
      </div>
    </div>
  );
};
