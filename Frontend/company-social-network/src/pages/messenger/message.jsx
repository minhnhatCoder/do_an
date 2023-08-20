/*
 * @description
 * @since         Saturday, 8 19th 2023, 7:04:15 am
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */
import React, { useState } from "react";
import { AiOutlineMore } from "react-icons/ai";
import { HiOutlinePhone, HiOutlineVideoCamera } from "react-icons/hi";
import { AnswerInput } from "../../components/post/Comment";
import AvatarUi from "../../components/avatar";
import { Link, useParams } from "react-router-dom";
import ConversationsServices from "../../services/conversationServies";
import { useRootState } from "../../store";

const Message = ({ conversation }) => {
  const { id } = useParams();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const userInfo = useRootState((state) => state.userInfo);

  const onSendMessage = () => {};
  return (
    <div className="w-2/3 h-[calc(100vh-75px)] border-l border-r">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <img
              className="w-12 h-12 rounded-full border"
              src={conversation?.participants?.find((p) => p?._id != userInfo?._id)?.image}
              alt=""
            />
            <span className="bottom-0 left-9 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <Link
              className="text-gray-700 text-base font-semibold cursor-pointer block hover:underline"
              to={`/profile/${conversation?.participants?.find((p) => p?._id != userInfo?._id)?._id}`}
            >
              {conversation?.participants?.find((p) => p?._id != userInfo?._id)?.display_name}
            </Link>
            <p className="text-green-500 w-56 text-sm">Đang hoạt động</p>
          </div>
        </div>
        <div className="w-max flex items-center gap-4">
          <HiOutlineVideoCamera className="w-6 h-6 text-neutral-400 cursor-pointer" />
          <HiOutlinePhone className="w-6 h-6 text-neutral-400 cursor-pointer" />
          <AiOutlineMore className="w-6 h-6 text-neutral-400 cursor-pointer" />
        </div>
      </div>
      <div className="h-[calc(100vh-235px)] overflow-y-auto bg-white p-3" id="scroll-custom">
        {/* người lạ */}
        <div className="flex gap-2 mt-3">
          <AvatarUi
            placement="left"
            data={{
              image: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/1/3/1134251/Cha-Eun-Woo2.jpeg",
              display_name: "Minh nhật",
            }}
          />
          <div>
            <p className="text-neutral-400 text-xs mb-1">10:05 AM</p>
            <div className="px-3 py-2 bg-[#f0f2f5] rounded-tr-xl rounded-br-xl rounded-bl-xl w-fit">
              <p dangerouslySetInnerHTML={{ __html: "heheh" }} />
            </div>
          </div>
        </div>
        {/* Bản thân */}
        <div className="flex justify-end w-full">
          <div className="mt-3">
            <p className="text-neutral-400 text-xs mb-1 text-right">10:05 AM</p>
            <div className="px-3 py-2 bg-[#1053f3] text-white rounded-tl-xl rounded-br-xl rounded-bl-xl w-fit">
              <p dangerouslySetInnerHTML={{ __html: "Chào bạn nhé" }} />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full px-4">
        <AnswerInput
          loading={loading}
          content={content}
          setContent={setContent}
          onComment={onSendMessage}
          files={attachments}
          setFiles={setAttachments}
          isUploadFile
        />
      </div>
    </div>
  );
};

export default Message;
