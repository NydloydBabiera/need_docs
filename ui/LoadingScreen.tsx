"use client";

import { useLoadingStore } from "@/lib/stores/useLoadingStore";

export default function LoadingScreen() {
  const { isLoading, loadingText } = useLoadingStore();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="bg-white px-6 py-5 rounded-lg shadow-lg flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-700">{loadingText}</p>
      </div>
    </div>
  );
}
