"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fetchDashboard } from "@/shared/api/mock-client";
import { fetchCarDataset } from "@/shared/api/car-dataset";
import { useI18n } from "@/shared/i18n/useI18n";

export const DashboardOverview = () => {
  const { t } = useI18n();
  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
  });
  const { data: carDataset } = useQuery({
    queryKey: ["car-dataset"],
    queryFn: fetchCarDataset,
  });

  const datasetStats = useMemo(() => {
    const rows = carDataset ?? [];
    if (rows.length === 0) {
      return {
        avgMsrp: 0,
        totalModels: 0,
        topMakes: [] as Array<{ make: string; count: number }>,
      };
    }
    const totalModels = rows.length;
    const avgMsrp = Math.round(rows.reduce((sum, row) => sum + (row.msrp || 0), 0) / totalModels);
    const makeMap = new Map<string, number>();
    rows.forEach((row) => {
      makeMap.set(row.make, (makeMap.get(row.make) ?? 0) + 1);
    });
    const topMakes = Array.from(makeMap.entries())
      .map(([make, count]) => ({ make, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
    return { avgMsrp, totalModels, topMakes };
  }, [carDataset]);

  return (
    <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-primary/10 p-8 backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">{t("admin.performance")}</p>
          <h2 className="mt-2 text-3xl font-semibold">{t("admin.revenueTitle")}</h2>
          <p className="mt-2 max-w-xl text-sm text-white/70">{t("admin.revenueSubtitle")}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">{t("admin.totalRevenue")}</p>
            <p className="mt-2 text-2xl font-semibold">${data?.totalRevenue.toLocaleString() ?? "—"}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">{t("admin.activeRentals")}</p>
            <p className="mt-2 text-2xl font-semibold">{data?.activeRentals ?? "—"}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">{t("admin.avgMsrp")}</p>
            <p className="mt-2 text-2xl font-semibold">
              ${datasetStats.avgMsrp ? datasetStats.avgMsrp.toLocaleString() : "—"}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">{t("admin.totalModels")}</p>
            <p className="mt-2 text-2xl font-semibold">{datasetStats.totalModels || "—"}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data?.revenueSeries ?? []} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff5f00" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#ff5f00" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" stroke="#888888" tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "rgba(18, 18, 18, 0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
              }}
              labelStyle={{ color: "#ffffff" }}
              itemStyle={{ color: "#ff5f00" }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#ff5f00" strokeWidth={2} fill="url(#revenueGlow)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-10 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={datasetStats.topMakes} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <XAxis dataKey="make" stroke="#888888" tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "rgba(18, 18, 18, 0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
              }}
              labelStyle={{ color: "#ffffff" }}
              itemStyle={{ color: "#ff5f00" }}
            />
            <Bar dataKey="count" fill="#ff5f00" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
