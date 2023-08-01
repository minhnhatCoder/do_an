import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const useRootState = create(
  persist(
    devtools((set) => ({
      userInfo: {},
      depts: [],
      positions: [],
      setUserInfo: (user) => set({ userInfo: user }),
      setDepts: (depts) => set({ depts: depts }),
      setPositions: (positions) => set({ positions: positions }),
    })),
    { name: "user" }
  )
);
