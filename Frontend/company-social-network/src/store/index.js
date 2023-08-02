import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const useRootState = create(
  persist(
    devtools((set) => ({
      userInfo: {},
      users: [],
      depts: [],
      positions: [],
      setUserInfo: (user) => set({ userInfo: user }),
      setUsers: (users) => set({ users: users }),
      setDepts: (depts) => set({ depts: depts }),
      setPositions: (positions) => set({ positions: positions }),
    })),
    { name: "user" }
  )
);
