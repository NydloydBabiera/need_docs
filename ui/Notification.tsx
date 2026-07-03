"use client";

import { useNotificationStore } from "@/lib/stores/useNotificationStore";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";


export default function Notification() {
  const {
    title,
    message,
    type,
    visible,
    hideNotification,
  } = useNotificationStore();

  if (!visible) return null;

  const styles = {
    success: {
      bg: "bg-green-50",
      border: "border-green-500",
      icon: "text-green-500",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-500",
      icon: "text-red-500",
    },
    warning: {
      bg: "bg-orange-50",
      border: "border-orange-500",
      icon: "text-orange-500",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-500",
      icon: "text-blue-500",
    },
  };

  const Icon =
    type === "success"
      ? CheckCircle
      : type === "error"
        ? XCircle
        : type === "warning"
          ? AlertTriangle
          : Info;

  return (
    <div className="fixed top-4 right-4 z-50 w-[450px] animate-in slide-in-from-right">
      <div
        className={`
          ${styles[type].bg}
          border-t-4
          ${styles[type].border}
          rounded-md
          shadow-lg
          p-4
          flex gap-3
        `}
      >
        <Icon
          size={22}
          className={`${styles[type].icon} mt-0.5 shrink-0`}
        />

        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">
            {title}
          </h3>

          <p className="text-sm text-gray-600 mt-1">
            {message}
          </p>
        </div>

        <button
          onClick={hideNotification}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}