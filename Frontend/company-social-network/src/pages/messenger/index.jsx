/*
 * @description
 * @since         Saturday, 8 19th 2023, 4:08:00 am
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */

import React, { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import Message from "./message";
import { BiSolidMessageDetail } from "react-icons/bi";
import Info from "./info";
import ConversationsServices from "../../services/conversationServies";
import { useRootState } from "../../store";
import RightContent from "./rightContent";
import { formatTimestamp } from "../../helper/timeHelper";
import { Empty, Spin } from "antd";

const Messenger = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const userInfo = useRootState((state) => state.userInfo);
  const { id } = useParams();
  const [activeConversation, setActiveConversation] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const getConversations = async () => {
    try {
      const params = {
        sort: "-last_message.created_at",
        ["participants[in]"]: [userInfo?._id],
        ["last_message[exists]"]: "true",
        limit,
        page,
      };
      setLoading(true);
      const res = await ConversationsServices.getConversations(params);
      setConversations(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  useEffect(() => {
    getConversations();
  }, []);
  useEffect(() => {
    setActiveConversation(id);
  }, [id]);
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
            <p className="text-neutral-400 cursor-pointer hover:underline text-xs">Xem thêm</p>
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
        <div className="flex items-center gap-2 mb-2 px-4">
          <BiSolidMessageDetail className="w-5 h-5 text-neutral-400" />
          <p className="text-neutral-400 ">Tất cả tin nhắn</p>
        </div>
        <Spin spinning={loading}>
          {" "}
          <div className="h-[calc(100vh-265px)] overflow-y-scroll" id="scroll-custom">
            {conversations?.map((conversation, index) => (
              <div
                className={`px-4 py-2 ${
                  activeConversation == conversation?._id && "bg-[#ebebef]"
                } hover:bg-[#ebebef] flex items-center justify-between cursor-pointer`}
                key={index}
                onClick={() => {
                  navigate("/chat/" + conversation?._id);
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <img
                      className="w-12 h-12 rounded-full border"
                      src={
                        conversation?.participants?.find((p) => p?._id != userInfo?._id)?.image ||
                        conversation?.participants?.[0]?.image
                      }
                      alt=""
                    />
                    <span className="bottom-0 left-9 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></span>
                  </div>
                  <div>
                    <p className="text-black font-semibold ">
                      {conversation?.participants?.find((p) => p?._id != userInfo?._id)?.display_name ||
                        conversation?.participants?.[0]?.display_name}
                    </p>
                    <p className="text-neutral-400 w-56 truncate text-sm">
                      {conversation?.last_message?.created_by?._id == userInfo?._id
                        ? "Bạn: " + conversation?.last_message?.content
                        : conversation?.last_message?.content}
                    </p>
                  </div>
                </div>
                <div className="w-max flex flex-col gap-2">
                  <p className="text-black text-sm">
                    {conversation?.last_message?.created_at
                      ? formatTimestamp(conversation?.last_message?.created_at)
                      : ""}
                  </p>
                  <div className="w-full flex justify-end">
                    <div className="inline-flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
                      2
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Spin>
      </div>
      <RightContent />
    </div>
  );
};

export default Messenger;
