/*
 * @description
 * @since         Saturday, 9 2nd 2023, 21:15:23 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */
import { create } from "zustand";

// Khởi tạo trạng thái ban đầu
const useSocketStore = create((set) => ({
  socket: null, // Khởi tạo socket là null
  setSocket: (socket) => set({ socket }), // Hàm để cập nhật socket
}));

export default useSocketStore;
