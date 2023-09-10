/*
 * @description
 * @since         Saturday, 8 19th 2023, 7:04:15 am
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineMore, AiOutlinePaperClip } from "react-icons/ai";
import { HiOutlinePhone, HiOutlineVideoCamera } from "react-icons/hi";
import { AnswerInput } from "../../components/post/Comment";
import AvatarUi from "../../components/avatar";
import { Link, useParams } from "react-router-dom";
import ConversationsServices from "../../services/conversationServies";
import { useRootState } from "../../store";
import Toast from "../../components/noti";
import CommentServices from "../../services/commentServices";
import { getFileName, isImageFile } from "../../helper/fileHelper";
import { formatTimestamp } from "../../helper/timeHelper";
import { Image, Spin } from "antd";
import useSocketStore from "../../store/socketStore";

const Message = ({ conversation, getConversation, setConversations, conversations }) => {
  const usersOnline = useRootState((state) => state?.usersOnline);
  const socket = useSocketStore((state) => state?.socket);
  const { id } = useParams();
  const [content, setContent] = useState("");
  const [loadingSend, setLoadingSend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);
  const [messages, setMessages] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const userInfo = useRootState((state) => state.userInfo);
  const scrollRef = useRef(null);
  const [hasMore, setHasMore] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const getMessages = async (isNewId) => {
    setLoading(true);
    try {
      const res = await CommentServices.getComments({ "target[eq]": id, sort: "-created_at", limit, page });
      const newMess = isNewId
        ? [...res.data.sort((a, b) => a?.created_at - b.created_at)]
        : [...res.data.sort((a, b) => a?.created_at - b.created_at), ...messages];
      setMessages(newMess);
      setHasMore(newMess?.length < res?.count);
      setLoading(false);
    } catch (error) {
      Toast("error", error?.message);
      setLoading(false);
    }
  };

  const onSendMessage = async () => {
    if (!content?.trim()) {
      return Toast("error", "Nội dung tin nhắn không được để trống!");
    }
    setLoadingSend(true);
    try {
      const res = await ConversationsServices.sendMessage(conversation?._id, {
        content,
        attachments,
      });
      if (attachments.length > 0) getConversation();
      setAttachments([]);
      setContent("");
      setLoadingSend(false);
      socket?.emit("sendMessage", {
        roomId: id,
        data: res?.data,
        userId: conversation?.participants?.find((p) => p?._id != userInfo?._id)?._id,
      });
    } catch (error) {
      setLoadingSend(false);
      Toast("error", error?.message);
    }
  };
  useEffect(() => {
    setMessages([]);
    setPage(1);
    getMessages(true);
    readAllMessages();
  }, [id]);
  useEffect(() => {
    id && getMessages();
  }, [page]);
  useEffect(() => {
    if (id && socket) {
      socket?.emit("joinRoom", id);
    }
  }, [id, socket]);

  useEffect(() => {
    socket &&
      socket?.on("getMessage", (mess) => {
        setArrivalMessage(mess);
      });
  }, [socket]);

  useEffect(() => {
    arrivalMessage && arrivalMessage?.target == id && setMessages([...messages, arrivalMessage]);
  }, [arrivalMessage]);

  const readAllMessages = async () => {
    try {
      await ConversationsServices.readAllMessages(id);
      if (!conversations?.find((c) => c?._id == id)?.last_message?.read_receipts?.includes(userInfo?._id)) {
        setConversations &&
          setConversations(
            conversations?.map((c) => {
              if (c._id == id) {
                return {
                  ...c,
                  last_message: { ...c.last_message, read_receipts: [...c.last_message.read_receipts, userInfo?._id] },
                };
              } else return c;
            })
          );
      }
    } catch (error) {
      Toast("error", error?.message);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      const innerElement = scrollRef.current.lastChild;
      if (innerElement) {
        innerElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [messages?.length]);

  const handleScroll = () => {
    if (!messages?.find((m) => m?.last_message?.read_receipts?.includes(userInfo?._id))) {
      readAllMessages();
    }
    if (scrollRef.current.scrollTop === 0 && hasMore) {
      setPage(page + 1);
    }
  };

  return (
    <div className="w-2/3 h-[calc(100vh-75px)] border-l border-r relative">
      <div className="p-4 border-b flex items-center justify-between">
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
            {usersOnline?.find(
              (on) =>
                on?._id == conversation?.participants?.find((p) => p?._id != userInfo?._id)?._id ||
                conversation?.participants?.every((p) => p?._id == userInfo?._id)
            ) ? (
              <span className="bottom-0 left-9 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></span>
            ) : null}
          </div>
          <div>
            <Link
              className="text-gray-700 text-base font-semibold cursor-pointer block hover:underline"
              to={`/profile/${
                conversation?.participants?.find((p) => p?._id != userInfo?._id)?._id ||
                conversation?.participants?.[0]?._id
              }`}
            >
              {conversation?.participants?.find((p) => p?._id != userInfo?._id)?.display_name ||
                conversation?.participants?.[0]?.display_name}
            </Link>
            {usersOnline?.find(
              (on) =>
                on?._id == conversation?.participants?.find((p) => p?._id != userInfo?._id)?._id ||
                conversation?.participants?.every((p) => p?._id == userInfo?._id)
            ) ? (
              <p className="text-green-500 w-56 text-sm">Đang hoạt động</p>
            ) : (
              <p className="text-red-500 w-56 text-sm">Đang offline</p>
            )}
          </div>
        </div>
        <div className="w-max flex items-center gap-4">
          <HiOutlineVideoCamera className="w-6 h-6 text-neutral-400 cursor-pointer" />
          <HiOutlinePhone className="w-6 h-6 text-neutral-400 cursor-pointer" />
          <AiOutlineMore className="w-6 h-6 text-neutral-400 cursor-pointer" />
        </div>
      </div>
      <Spin spinning={loading} size="large">
        <div
          className="h-[calc(100vh-235px)] overflow-y-auto bg-[#f8f8fc] p-3"
          id="scroll-custom"
          ref={scrollRef}
          onScroll={handleScroll}
        >
          {messages?.map((message, index) => {
            if (message.created_by?._id == userInfo?._id) {
              return (
                <div className="flex justify-end w-full" key={message?._id}>
                  <div className="mt-3">
                    <p className="text-neutral-400 text-xs mb-1 text-right">{formatTimestamp(message?.created_at)}</p>
                    <div
                      className="px-3 py-2 bg-[#1053f3] text-white rounded-tl-xl rounded-br-xl rounded-bl-xl w-fit"
                      style={{
                        boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
                      }}
                    >
                      <p dangerouslySetInnerHTML={{ __html: message?.content }} />
                      <div className={`${message?.attachments?.length > 0 && "mt-2"} flex flex-col gap-2`}>
                        {message?.attachments?.map((attachment, index) => {
                          if (isImageFile(attachment?.public_id)) {
                            return (
                              <Image
                                src={attachment?.url}
                                alt=""
                                key={index}
                                className="!w-48 !h-48 object-cover rounded-lg"
                              />
                            );
                          } else {
                            return (
                              <div key={index} className="flex items-center gap-1">
                                <AiOutlinePaperClip className="w-5 h-5 cursor-pointer text-white" />
                                <a className="text-white hover:underline" href={attachment?.url}>
                                  {getFileName(attachment?.public_id)}
                                </a>
                              </div>
                            );
                          }
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            } else
              return (
                <div className="flex gap-2 mt-3" key={message?._id}>
                  <AvatarUi placement="left" data={message.created_by} />
                  <div>
                    <p className="text-neutral-400 text-xs mb-1">{formatTimestamp(message?.created_at)}</p>
                    <div
                      className="px-3 py-2 bg-white rounded-tr-xl rounded-br-xl rounded-bl-xl w-fit"
                      style={{
                        boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
                      }}
                    >
                      <p dangerouslySetInnerHTML={{ __html: message?.content }} />
                      <div className={`${message?.attachments?.length > 0 && "mt-2"} flex flex-col gap-2`}>
                        {message?.attachments?.map((attachment, index) => {
                          if (isImageFile(attachment?.public_id)) {
                            return (
                              <Image
                                src={attachment?.url}
                                alt=""
                                key={index}
                                className="!w-48 !h-48 object-cover rounded-lg"
                              />
                            );
                          } else {
                            return (
                              <div key={index} className="flex items-center gap-1">
                                <AiOutlinePaperClip className="w-5 h-5 cursor-pointer text-neutral-400" />
                                <a className="text-neutral-400 hover:underline" href={attachment?.url}>
                                  {getFileName(attachment?.public_id)}
                                </a>
                              </div>
                            );
                          }
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
          })}
        </div>
      </Spin>

      <div className="w-full px-4 absolute bottom-2 bg-white">
        <AnswerInput
          loading={loadingSend}
          placeholder={"Viết tin nhắn ..."}
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
