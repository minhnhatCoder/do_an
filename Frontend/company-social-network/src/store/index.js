import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import UserServices from "../services/user";

export const useRootState = create(
  persist(
    devtools((set, getState) => ({
      userInfo: {},
      users: [],
      depts: [],
      positions: [],
      setUserInfo: (user) => set({ userInfo: user }),
      setUsers: (users) => set({ users: users }),
      setDepts: (depts) => set({ depts: depts }),
      setPositions: (positions) => set({ positions: positions }),
      resetUserInfo: async () => {
        const state = getState();

        try {
          const res = await UserServices.getUser(state?.userInfo?._id);
          set({ userInfo: res?.data });
        } catch (error) {
          console.log(error);
        }
      },
    })),
    { name: "user" }
  )
);
