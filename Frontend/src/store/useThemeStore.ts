import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useThemeStore = create(
  persist(
    (set) => ({
     
      theme: 'light',
      

      
      setStep: (theme:any) =>
        set(() => ({
          step: theme,
        })),


    
    }),
    {
      name: "theme-storage", // localStorage key

    storage: createJSONStorage(() => localStorage),
    }
  )
);

