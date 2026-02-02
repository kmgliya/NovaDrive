"use client";

import Image from "next/image";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSpecialists, updateSpecialist } from "@/shared/api/mock-client";
import { Specialist } from "@/entities/specialist/model/types";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { useI18n } from "@/shared/i18n/useI18n";

type Drafts = Record<string, Partial<Specialist>>;

export const SpecialistManagement = () => {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const { data: specialists } = useQuery({
    queryKey: ["specialists"],
    queryFn: fetchSpecialists,
  });

  const [drafts, setDrafts] = useState<Drafts>({});

  const updateMutation = useMutation({
    mutationFn: (payload: { id: string; data: Partial<Specialist> }) =>
      updateSpecialist(payload.id, payload.data),
    onSuccess: (updated) => {
      queryClient.setQueryData<Specialist[]>(["specialists"], (prev = []) =>
        prev.map((spec) => (spec.id === updated.id ? updated : spec))
      );
    },
  });

  const updateDraft = (id: string, field: keyof Specialist, value: string) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const getDraftValue = (id: string, field: keyof Specialist, fallback: string) => {
    return (drafts[id]?.[field] as string | undefined) ?? fallback;
  };

  return (
    <section id="specialists" className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted">{t("admin.nav.specialists")}</p>
        <h3 className="mt-2 text-2xl font-semibold">{t("admin.specialistsTitle")}</h3>
        <p className="mt-2 text-sm text-white/70">{t("admin.specialistsDesc")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {specialists?.map((spec) => (
          <div key={spec.id} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-full border border-white/10">
                <Image src={spec.avatar} alt={spec.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{spec.name}</p>
                <p className="text-xs text-white/60">{spec.specialization}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              <Input
                label={t("admin.label.name")}
                value={getDraftValue(spec.id, "name", spec.name)}
                onChange={(event) => updateDraft(spec.id, "name", event.target.value)}
              />
              <Input
                label={t("admin.label.avatar")}
                value={getDraftValue(spec.id, "avatar", spec.avatar)}
                onChange={(event) => updateDraft(spec.id, "avatar", event.target.value)}
              />
              <Input
                label={t("admin.label.specialization")}
                value={getDraftValue(spec.id, "specialization", spec.specialization)}
                onChange={(event) => updateDraft(spec.id, "specialization", event.target.value)}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                className="rounded-full px-5 py-2 text-xs"
                onClick={() =>
                  updateMutation.mutate({
                    id: spec.id,
                    data: {
                      name: getDraftValue(spec.id, "name", spec.name),
                      avatar: getDraftValue(spec.id, "avatar", spec.avatar),
                      specialization: getDraftValue(spec.id, "specialization", spec.specialization),
                    },
                  })
                }
              >
                {t("admin.btn.saveSpecialist")}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
