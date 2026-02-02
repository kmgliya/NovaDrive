"use client";

import { useMutation } from "@tanstack/react-query";
import { lockSlot as lockSlotApi, releaseSlot as releaseSlotApi } from "@/shared/api/mock-client";
import { useSlotLockStore } from "@/features/lock-slot/model/store";
import { getCurrentUser } from "@/shared/api/current-user";

const DEFAULT_TTL = 3 * 60_000;

export const useLockSlot = () => {
  const lockSlotLocal = useSlotLockStore((state) => state.lockSlot);
  const releaseSlotLocal = useSlotLockStore((state) => state.releaseSlot);
  const currentUser = getCurrentUser();

  const lockMutation = useMutation({
    mutationFn: (payload: { slotId: string; specialistId: string; startTime: string; endTime: string }) =>
      lockSlotApi({ ...payload, userId: currentUser.id, ttlMs: DEFAULT_TTL }),
    onSuccess: (lock) => {
      lockSlotLocal(lock.slotId, lock.expiresAt - Date.now());
    },
  });

  const releaseMutation = useMutation({
    mutationFn: (slotId: string) => releaseSlotApi({ slotId, userId: currentUser.id }),
    onSuccess: (_, slotId) => {
      releaseSlotLocal(slotId);
    },
  });

  return {
    lockSlot: lockMutation.mutateAsync,
    releaseSlot: releaseMutation.mutateAsync,
    isLocking: lockMutation.isPending,
    isReleasing: releaseMutation.isPending,
    error: lockMutation.error ?? releaseMutation.error,
  };
};
