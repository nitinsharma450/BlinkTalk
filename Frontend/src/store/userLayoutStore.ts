import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useLayoutStore = create(
  persist(
    (set) => ({
      activeTab: "chats",
      selectedContact:null,
      setSelectedContact:(contact:any)=>set({setSelectedContact:contact}),

      setActiveTab: (tab: any) =>
        set(() => ({
          activeTab: tab,
        })),
    }),
    {
      name: "theme-storage", // localStorage key

      storage: createJSONStorage(() => localStorage),
    },
  ),
);
