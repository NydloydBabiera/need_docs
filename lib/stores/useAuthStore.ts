import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
    user_id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
};

type AuthStore = {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            clearUser: () => set({ user: null }),
        }),
        {
            name: "auth-storage",
        }
    )
);