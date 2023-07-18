import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useUserInfo = create(
  devtools((set) => ({
    userInfo: {},
    setUserInfo: (user) => set({ userInfo: user }),
  }))
);
