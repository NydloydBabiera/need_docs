import { create } from "zustand";

type NotificationType =
  | "success"
  | "error"
  | "warning"
  | "info";

interface NotificationState {
  title: string;
  message: string;
  type: NotificationType;
  visible: boolean;

  showNotification: (
    title: string,
    message: string,
    type: NotificationType
  ) => void;

  hideNotification: () => void;
}

export const useNotificationStore =
  create<NotificationState>((set) => ({
    title: "",
    message: "",
    type: "info",
    visible: false,

    showNotification: (title, message, type) => {
      set({
        title,
        message,
        type,
        visible: true,
      });

      setTimeout(() => {
        set({ visible: false });
      }, 5000);
    },

    hideNotification: () =>
      set({
        visible: false,
      }),
  }));