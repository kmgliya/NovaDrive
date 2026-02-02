import { User } from "@/entities/user/model/types";
import { getAuthUser } from "@/features/auth/model/store";
import { MOCK_USERS } from "@/shared/api/mock-data";

const loadStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;
  try {
    const direct = window.localStorage.getItem("novadrive-current-user");
    if (direct) {
      return JSON.parse(direct) as User;
    }
    const raw = window.localStorage.getItem("novadrive-auth");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: { user?: User | null } };
    return parsed?.state?.user ?? null;
  } catch {
    return null;
  }
};

export const getCurrentUser = (): User => {
  return getAuthUser() ?? loadStoredUser() ?? MOCK_USERS[1];
};
