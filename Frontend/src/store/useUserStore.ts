import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated : false,

      setUser: (userData: any) =>
        set(() => ({
          user: userData,
          isAuthenticated: true,
        })),

      clear: () =>
        set(() => ({
          user: null,
          isAuthenticated : false,
        })),
    }),
    {
      name: "user-storage", // localStorage key

        storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useUserStore;
