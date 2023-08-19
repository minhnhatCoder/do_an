/*
 * @description
 * @since         Saturday, 8 19th 2023, 8:03:40 am
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */
import React from "react";
import { Link } from "react-router-dom";
import { IoIosNotifications } from "react-icons/io";
import { Switch } from "antd";
import { BsFillInfoCircleFill, BsImages } from "react-icons/bs";
import { AiOutlineFileText } from "react-icons/ai";
import { GrShieldSecurity } from "react-icons/gr";

const Info = () => {
  return (
    <div className="w-1/4 h-[calc(100vh-75px)] ">
      <div className="p-4 border-b flex items-center justify-center gap-2">
        <BsFillInfoCircleFill className="w-5 h-5 text-gray-400" />
        <p className="text-lg font-bold text-center">Thông tin cuộc hội thoại</p>
      </div>
      <div className="flex items-center justify-center mt-3">
        <div className="relative">
          <img
            className="w-20 h-20 rounded-full"
            src="https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/1/3/1134251/Cha-Eun-Woo2.jpeg"
            alt="Large avatar"
          />
          <span className="bottom-0 left-14 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white  rounded-full"></span>
        </div>
      </div>
      <div className="mt-2">
        <Link className="text-gray-700 text-base font-bold text-center cursor-pointer block hover:underline">
          Cha Eun Woo
        </Link>
        <p className="text-gray-400 text-xs text-center">Đang hoạt động</p>
      </div>
      <div className="flex items-center justify-between py-4 px-6 border-b mt-4">
        <div className="flex gap-2 items-center">
          <IoIosNotifications className="w-5 h-5 text-neutral-400" />
          <p className="text-neutral-400">Thông báo</p>
        </div>
        <Switch defaultChecked />
      </div>
      <div className="flex items-center justify-between py-4 px-6 border-b mt-4">
        <div className="flex gap-2 items-center">
          <BsImages className="w-5 h-5 text-neutral-400" />
          <p className="text-neutral-400">Hình ảnh</p>
        </div>
      </div>
      <div className="flex items-center justify-between py-4 px-6 border-b mt-4">
        <div className="flex gap-2 items-center">
          <AiOutlineFileText className="w-5 h-5 text-neutral-400" />
          <p className="text-neutral-400">Files</p>
        </div>
      </div>
      <div className="flex items-center justify-between py-4 px-6 border-b mt-4">
        <div className="flex gap-2 items-center">
          <GrShieldSecurity className="w-5 h-5 text-neutral-400" />
          <p className="text-neutral-400">Quyền riêng tư & hỗ trợ</p>
        </div>
      </div>
    </div>
  );
};

export default Info;
