"use client";

import Link from "next/link";
import { LogOut, Menu, User } from "lucide-react";
import { useAuthStore } from "@/features/auth/model/store";
import { useI18n } from "@/shared/i18n/useI18n";

export const Header = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { t, locale, setLocale } = useI18n();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark/90 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Логотип */}
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl font-bold tracking-tighter hover:opacity-80 transition">
            NOVA<span className="text-primary">DRIVE</span>
          </Link>
          <div className="hidden sm:flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.25em]">
            <button
              onClick={() => setLocale("en")}
              className={`rounded-full px-2 py-1 transition ${
                locale === "en" ? "bg-primary text-white" : "text-white/60 hover:text-white"
              }`}
              aria-label={t("nav.en")}
            >
              EN
            </button>
            <button
              onClick={() => setLocale("ru")}
              className={`rounded-full px-2 py-1 transition ${
                locale === "ru" ? "bg-primary text-white" : "text-white/60 hover:text-white"
              }`}
              aria-label={t("nav.ru")}
            >
              RU
            </button>
          </div>
        </div>

        {/* Навигация (скрыта на мобильных) */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/services" className="text-sm font-medium hover:text-primary transition uppercase tracking-wide">
            {t("nav.services")}
          </Link>
          <Link href="/booking" className="text-sm font-medium hover:text-primary transition uppercase tracking-wide">
            {t("nav.booking")}
          </Link>
          {user?.role === "admin" ? (
            <Link href="/admin" className="text-sm font-medium hover:text-primary transition uppercase tracking-wide">
              {t("nav.admin")}
            </Link>
          ) : null}
          <Link href="/about" className="text-sm font-medium hover:text-primary transition uppercase tracking-wide">
            {t("nav.about")}
          </Link>
        </nav>

        {/* Правая часть: Вход / Меню */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide hover:text-primary transition"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:block">{user.name}</span>
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/60 hover:text-white transition"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:block">{t("nav.logout")}</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 text-sm font-bold uppercase hover:text-primary transition"
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:block">{t("nav.signin")}</span>
            </Link>
          )}
          
          <button className="md:hidden text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};