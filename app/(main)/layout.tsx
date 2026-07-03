"use client";

import AuthProvider from "@/ui/AuthProvider";
import NavBar from "@/ui/Navbar";

export default function ProtectedMain({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="app-content">
      <AuthProvider>{children}</AuthProvider>
    </main>
  );
}
