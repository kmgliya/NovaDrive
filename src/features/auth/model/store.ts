import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/entities/user/model/types";

type AuthState = {
  user: User | null;
  login: (payload: { email: string; name?: string; role?: User["role"] }) => void;
  register: (payload: { name: string; email: string; phone?: string; role?: User["role"] }) => void;
  logout: () => void;
};

const saveCurrentUser = (user: User | null) => {
  if (typeof window === "undefined") return;
  try {
    if (!user) {
      window.localStorage.removeItem("novadrive-current-user");
      return;
    }
    window.localStorage.setItem("novadrive-current-user", JSON.stringify(user));
  } catch {
    // ignore
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: ({ email, name, role }) =>
        set(() => {
          const user = {
            id: `u-${email}`,
            name: name ?? email.split("@")[0],
            email,
            phone: "",
            role: role ?? "user",
          };
          saveCurrentUser(user);
          return { user };
        }),
      register: ({ name, email, phone, role }) =>
        set(() => {
          const user = {
            id: `u-${email}`,
            name,
            email,
            phone: phone ?? "",
            role: role ?? "user",
          };
          saveCurrentUser(user);
          return { user };
        }),
      logout: () => {
        saveCurrentUser(null);
        return set({ user: null });
      },
    }),
    { name: "novadrive-auth" }
  )
);

export const getAuthUser = () => useAuthStore.getState().user;
