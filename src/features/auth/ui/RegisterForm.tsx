"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { useAuthStore } from "@/features/auth/model/store";
import { useI18n } from "@/shared/i18n/useI18n";

export const RegisterForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((state) => state.register);
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const role = adminCode.trim() === "novadrive-admin" ? "admin" : "user";
      register({ name, email, phone, role });
      setLoading(false);
      router.push("/profile");
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-muted">{t("auth.register.tag")}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{t("auth.register.title")}</h1>
        <p className="text-sm text-white/70">{t("auth.register.subtitle")}</p>
      </div>

      <Input
        label={t("auth.register.name")}
        type="text"
        placeholder="Anna Clarke"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />
      <Input
        label={t("auth.register.email")}
        type="email"
        placeholder="anna@novadrive.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <Input
        label={t("auth.register.phone")}
        type="tel"
        placeholder="+1 (212) 555-0199"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        required
      />
      <Input
        label={t("auth.register.adminCode")}
        type="text"
        placeholder={t("auth.register.adminCodeHint")}
        value={adminCode}
        onChange={(event) => setAdminCode(event.target.value)}
      />
      <Input
        label={t("auth.register.password")}
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      <Button type="submit" disabled={loading} className="w-full mt-2">
        {loading ? t("auth.register.ctaLoading") : t("auth.register.cta")}
      </Button>

      <div className="text-center text-sm text-white/60">
        {t("auth.register.haveAccount")}{" "}
        <Link href="/login" className="text-primary hover:underline font-semibold">
          {t("auth.register.login")}
        </Link>
      </div>
    </form>
  );
};
