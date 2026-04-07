import { create } from "zustand";
import { persist } from "zustand/middleware";

const useLoginStore = create(
  persist(
    (set) => ({
     
      step: 1,
      userPhoneData: null,

      
      setStep: (newStep:any) =>
        set(() => ({
          step: newStep,
        })),

      setUserPhoneData: (data:any) =>
        set(() => ({
          userPhoneData: data,
        })),

      resetLoginState: () =>
        set(() => ({
          step: 1,
          userPhoneData: null,
        })),
    }),
    {
      name: "login-storage", // localStorage key

      // 🔹 Only persist required fields
      partialize: (state:any) => ({
        step: state.step,
        userPhoneData: state.userPhoneData,
      }),
    }
  )
);

export default useLoginStore;