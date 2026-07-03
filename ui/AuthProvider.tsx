"use client";

import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useEffect } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, clearUser } = useAuthStore();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (!res.ok) {
          clearUser();
          return;
        }

        const user = await res.json();
        console.log("🚀 ~ checkUser ~ user:", user);
        setUser(user);
      } catch {
        clearUser();
      }
    };

    checkUser();
  }, [setUser, clearUser]);

  return <>{children}</>;
}
