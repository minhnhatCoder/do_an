/*
 * @description
 * @since         Saturday, 8 12th 2023, 21:56:17 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */
import { Popover, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { BiAddToQueue, BiCommentDetail, BiSolidFlagAlt } from "react-icons/bi";
import { CgArrowsExchangeAltV } from "react-icons/cg";
import { GoPaperclip } from "react-icons/go";
import { TbFileDescription } from "react-icons/tb";

const Status = ({ id = 1, hideValue, onChange, hasTitle }) => {
  const handleShowTag = (id) => {
    switch (id) {
      case 1:
        return <p className="text-orange-500 font-bold">Cần làm</p>;
      case 2:
        return <p className="text-blue-500 font-bold">Đang làm</p>;
      case 3:
        return <p className="text-green-500 font-bold">Hoàn thành</p>;
      case 4:
        return <p className="text-red-500 font-bold">Đã hủy</p>;

      default:
        return <p className="text-orange-500 font-bold">Cần làm</p>;
    }
  };
  useEffect(() => {
    handleShowTag(id);
  }, [id]);

  const content = (
    <div className="w-[250px]">
      <div
        className="flex items-center justify-between p-2 rounded-lg bg-blue-200 text-blue-500 cursor-pointer hover:bg-blue-100"
        onClick={() => onChange && onChange(1)}
      >
        <div className="flex items-center gap-2 ">
          <TbFileDescription className="w-6 h-6" />
          <p className="font-semibold">Cần làm</p>
        </div>
        {id == 1 && <AiOutlineCheck className="w-6 h-6" color="green" />}
      </div>
      <div
        className="flex items-center justify-between p-2 rounded-lg bg-orange-200 text-orange-500 mt-2 cursor-pointer hover:bg-orange-100"
        onClick={() => onChange && onChange(2)}
      >
        <div className="flex items-center gap-2 ">
          <BiCommentDetail className="w-6 h-6" />
          <p className="font-semibold">Đang làm</p>
        </div>
        {id == 2 && <AiOutlineCheck className="w-6 h-6" color="green" />}
      </div>
      <div
        className="flex items-center justify-between p-2 rounded-lg bg-green-200 text-green-500 mt-2 cursor-pointer hover:bg-green-100"
        onClick={() => onChange && onChange(3)}
      >
        <div className="flex items-center gap-2 ">
          <GoPaperclip className="w-6 h-6" />
          <p className="font-semibold">Hoàn thành</p>
        </div>
        {id == 3 && <AiOutlineCheck className="w-6 h-6" color="green" />}
      </div>
      <div
        className="flex items-center justify-between p-2 rounded-lg bg-red-200 text-red-500 mt-2 cursor-pointer hover:bg-red-100"
        onClick={() => onChange && onChange(4)}
      >
        <div className="flex items-center gap-2 ">
          <BiAddToQueue className="w-6 h-6" />
          <p className="font-semibold">Hủy</p>
        </div>
        {id == 4 && <AiOutlineCheck className="w-6 h-6" color="green" />}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-center gap-2">
        {hasTitle && <p className="font-semibold">Trạng thái</p>}
        {hideValue ? null : handleShowTag(id)}
        {onChange ? (
          <Popover placement="bottom" title={"Đặt độ ưu tiên"} content={content} trigger="click">
            <CgArrowsExchangeAltV className="hover:bg-gray-100 p-1 rounded-md w-6 h-6 cursor-pointer" />
          </Popover>
        ) : null}
      </div>
    </div>
  );
};

export default Status;
