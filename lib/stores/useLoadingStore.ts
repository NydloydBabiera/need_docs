import { create } from "zustand";

type LoadingState = {
  isLoading: boolean;
  loadingText: string;

  startLoading: (text?: string) => void;
  stopLoading: () => void;
};

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  loadingText: "Loading...",

  startLoading: (text = "Loading...") =>
    set({
      isLoading: true,
      loadingText: text,
    }),

  stopLoading: () =>
    set({
      isLoading: false,
      loadingText: "Loading...",
    }),
}));