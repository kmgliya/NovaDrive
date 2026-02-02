import { create } from "zustand";
import { persist } from "zustand/middleware";

type SlotLockState = {
  locks: Record<string, { expiresAt: number }>;
  lockSlot: (slotId: string, ttlMs: number) => void;
  releaseSlot: (slotId: string) => void;
  isLocked: (slotId: string) => boolean;
  cleanupExpired: () => void;
};

const timers = new Map<string, ReturnType<typeof setTimeout>>();

const scheduleRelease = (slotId: string, expiresAt: number, set: (fn: (state: SlotLockState) => SlotLockState) => void) => {
  if (timers.has(slotId)) {
    clearTimeout(timers.get(slotId));
  }
  const timeout = Math.max(0, expiresAt - Date.now());
  const timer = setTimeout(() => {
    set((state) => {
      const next = { ...state.locks };
      delete next[slotId];
      return { ...state, locks: next };
    });
  }, timeout);
  timers.set(slotId, timer);
};

export const useSlotLockStore = create<SlotLockState>()(
  persist(
    (set, get) => ({
      locks: {},
      lockSlot: (slotId, ttlMs) => {
        const expiresAt = Date.now() + ttlMs;
        set((state) => ({
          ...state,
          locks: {
            ...state.locks,
            [slotId]: { expiresAt },
          },
        }));
        scheduleRelease(slotId, expiresAt, set);
      },
      releaseSlot: (slotId) => {
        if (timers.has(slotId)) {
          clearTimeout(timers.get(slotId));
          timers.delete(slotId);
        }
        set((state) => {
          const next = { ...state.locks };
          delete next[slotId];
          return { ...state, locks: next };
        });
      },
      isLocked: (slotId) => {
        const lock = get().locks[slotId];
        if (!lock) return false;
        return lock.expiresAt > Date.now();
      },
      cleanupExpired: () => {
        const now = Date.now();
        set((state) => {
          const next: SlotLockState["locks"] = {};
          Object.entries(state.locks).forEach(([slotId, lock]) => {
            if (lock.expiresAt > now) {
              next[slotId] = lock;
              scheduleRelease(slotId, lock.expiresAt, set);
            }
          });
          return { ...state, locks: next };
        });
      },
    }),
    {
      name: "novadrive-slot-locks",
      onRehydrateStorage: () => (state) => {
        state?.cleanupExpired();
      },
    }
  )
);
