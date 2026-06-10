"use client";

import NavBar from "@/ui/Navbar";


export default function ProtectedMain({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="app-content">
      <NavBar />
      {children}
    </main>
  );
}
