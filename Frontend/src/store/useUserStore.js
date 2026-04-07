import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => ({
     
     
      user:null,
      isAuthencated:false,

      
      

      setUser: (userData) =>
        set(() => ({
          user: userData,
          isAuthencated:true
        })),

      clear: () =>
        set(() => ({
         user:null,
          isAuthencated: false,
        })),
    }),
    {
      name: "login-storage", // localStorage key

    getStorage: () => localStorage 
    }
  )
);

export default useLoginStore;