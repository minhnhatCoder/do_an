/*
 * @description
 * @since         Saturday, 8 19th 2023, 4:08:00 am
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */

import React from "react";
import { BsSearch } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Messenger = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center">
      <div className="w-1/4 h-[calc(100vh-75px)] py-4">
        <div className=" flex items-center justify-between mb-3 px-4">
          <p className="font-bold text-2xl text-[#1053f3]">Messenges</p>
          <div className="flex items-center gap-3">
            <FiEdit className="w-5 h-5 text-neutral-400 cursor-pointer" />
            <BsSearch className="w-5 h-5 text-neutral-400 cursor-pointer" />
          </div>
        </div>
        <div className="mb-3 px-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-neutral-400 cursor-pointer">Đang online</p>
            <p className="text-neutral-400 cursor-pointer hover:underline">Xem tất cả</p>
          </div>
          <div className="flex items-center gap-3">
            {[1, 2, 3, 4, 5]?.map((u, index) => (
              <div className="relative" key={index}>
                <img
                  className="w-12 h-12 rounded-full border"
                  src="https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/1/3/1134251/Cha-Eun-Woo2.jpeg"
                  alt=""
                />
                <span className="bottom-0 left-9 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></span>
              </div>
            ))}
          </div>
        </div>
        <div className="h-[calc(100vh-235px)] overflow-y-scroll" id="style-3">
          {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5]?.map((u, index) => (
            <div
              className="px-4 py-2 hover:bg-[#ebebef] flex items-center justify-between cursor-pointer"
              key={index}
              onClick={() => {
                navigate("/chat/" + u);
              }}
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <img
                    className="w-12 h-12 rounded-full border"
                    src="https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/1/3/1134251/Cha-Eun-Woo2.jpeg"
                    alt=""
                  />
                  <span className="bottom-0 left-9 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <p className="text-black font-semibold ">Bình Đẹp trai</p>
                  <p className="text-neutral-400 w-56 truncate text-sm">
                    Chào ae nha Chào ae nhaChào ae nhaChào ae nhaChào ae nhaChào ae nhaChào ae nhaChào ae nha
                  </p>
                </div>
              </div>
              <div className="w-max flex flex-col gap-2">
                <p className="text-black text-sm">12:50 AM</p>
                <div className="w-full flex justify-end">
                  <div className="inline-flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
                    2
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-2/4 h-[calc(100vh-75px)] border-l border-r">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <img
                className="w-12 h-12 rounded-full border"
                src="https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/1/3/1134251/Cha-Eun-Woo2.jpeg"
                alt=""
              />
              <span className="bottom-0 left-9 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <p className="text-black font-semibold ">Bình Đẹp trai</p>
              <p className="text-green-500 w-56 text-sm">Đang hoạt động</p>
            </div>
          </div>
          <div className="w-max flex items-center gap-2"></div>
        </div>
      </div>
      <div className="w-1/4 h-[calc(100vh-75px)]"></div>
    </div>
  );
};

export default Messenger;
