"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { useAuthStore } from "@/features/auth/model/store";
import { useI18n } from "@/shared/i18n/useI18n";

export const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Имитация запроса на сервер
    setTimeout(() => {
      const role = adminCode.trim() === "novadrive-admin" ? "admin" : undefined;
      login({ email, role });
      setLoading(false);
      router.push('/profile'); // После входа кидаем в профиль
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-muted">{t("auth.login.tag")}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{t("auth.login.title")}</h1>
        <p className="text-sm text-white/70">{t("auth.login.subtitle")}</p>
      </div>

      <Input 
        label={t("auth.login.email")}
        type="email" 
        placeholder="john@example.com" 
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required 
      />
      
      <Input 
        label={t("auth.login.password")}
        type="password" 
        placeholder="••••••••" 
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required 
      />
      <Input
        label={t("auth.login.adminCode")}
        type="text"
        placeholder={t("auth.login.adminCodeHint")}
        value={adminCode}
        onChange={(event) => setAdminCode(event.target.value)}
      />

      <Button type="submit" disabled={loading} className="w-full mt-2">
        {loading ? t("auth.login.ctaLoading") : t("auth.login.cta")}
      </Button>

      <div className="text-center text-sm text-white/60">
        {t("auth.login.noAccount")}{" "}
        <Link href="/register" className="text-primary hover:underline font-semibold">
          {t("auth.login.register")}
        </Link>
      </div>    
    </form>
  );
};