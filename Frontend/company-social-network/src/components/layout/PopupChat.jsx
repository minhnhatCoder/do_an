import React, { useState } from "react";
import usePopupChatStore from "../../store/popupChatStore";
import { useRootState } from "../../store";
import { AiOutlineClose, AiOutlineCloseCircle, AiOutlineLine, AiOutlinePaperClip } from "react-icons/ai";
import { HiOutlinePhone, HiOutlineVideoCamera } from "react-icons/hi";
import { Image, Popover } from "antd";
import CommentServices from "../../services/commentServices";
import useSocketStore from "../../store/socketStore";
import ConversationsServices from "../../services/conversationServies";
import { useRef } from "react";
import { useEffect } from "react";
import Toast from "../noti";
import { AnswerInput } from "../post/Comment";
import { getFileName, isImageFile } from "../../helper/fileHelper";
import { formatTimestamp } from "../../helper/timeHelper";
import AvatarUi from "../avatar";
import msg_sound from "../../assets/msg_sound.wav";

const PopupChat = () => {
  const userInfo = useRootState((state) => state?.userInfo);
  const usersOnline = useRootState((state) => state.usersOnline);
  const conversations = usePopupChatStore((state) =>
    state?.conversations?.map((c) => ({
      ...c,
      receiver: c?.participants?.find((u) => u?._id !== userInfo?._id),
    }))
  );
  const closeConversation = usePopupChatStore((state) => state?.closeConversation);
  const showConversation = usePopupChatStore((state) => state?.showConversation);

  return (
    <div className="absolute left-0 right-4 h-[450px] absolute bottom-0 pointer-events-none flex gap-2 z-10">
      <div className="flex-1 items-start justify-end flex gap-4">
        {conversations?.map((conversation) => {
          if (conversation?.isPopup) return <MessageModal key={conversation?._id} conversation={conversation} />;
        })}
      </div>
      <div className="flex items-center justify-end pb-3 gap-2 flex-col w-20">
        {conversations.map((item, index) => {
          if (!item?.isPopup)
            return (
              <Popover
                key={index}
                content={
                  <div className="w-40">
                    <p className="text-neutral-500 truncate">
                      {item?.last_message?.created_by?._id == userInfo?._id ? "Bạn :" : ""}{" "}
                      {item?.last_message?.content}
                    </p>
                  </div>
                }
                title={<p className="w-40 truncate font-semibold">{item?.receiver?.display_name}</p>}
                placement="left"
                trigger="hover"
              >
                <div className="relative cursor-pointer pointer-events-auto">
                  <img
                    className="w-14 h-14 rounded-full"
                    src={item?.receiver?.image}
                    alt=""
                    onClick={() => {
                      showConversation(item?._id);
                    }}
                    style={{
                      boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
                    }}
                  />
                  {usersOnline?.find((u) => u?._id == item?.receiver?._id) && (
                    <span className="bottom-0 left-11 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></span>
                  )}

                  <span
                    className="top-0 left-10 absolute  w-5 h-5 rounded-full bg-white"
                    onClick={() => {
                      closeConversation(item?._id);
                    }}
                  >
                    <AiOutlineCloseCircle className="w-5 h-5" />
                  </span>
                </div>
              </Popover>
            );
        })}
      </div>
    </div>
  );
};

export default PopupChat;

const MessageModal = ({ conversation }) => {
  const socket = useSocketStore((state) => state?.socket);
  const closeConversation = usePopupChatStore((state) => state?.closeConversation);
  const showConversation = usePopupChatStore((state) => state?.showConversation);
  const userInfo = useRootState((state) => state?.userInfo);
  const usersOnline = useRootState((state) => state.usersOnline);
  const [content, setContent] = useState("");
  const [loadingSend, setLoadingSend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);
  const [messages, setMessages] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const scrollRef = useRef(null);
  const [hasMore, setHasMore] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const getMessages = async () => {
    setLoading(true);
    try {
      const res = await CommentServices.getComments({
        "target[eq]": conversation?._id,
        sort: "-created_at",
        limit,
        page,
      });
      const newMess = [...res.data.sort((a, b) => a?.created_at - b.created_at), ...messages];
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
      setAttachments([]);
      setContent("");
      setLoadingSend(false);
      socket?.emit("sendMessage", {
        userIds: conversation?.participants?.map((u) => u?._id),
        data: { ...res?.data, type: "message" },
      });
    } catch (error) {
      setLoadingSend(false);
      Toast("error", error?.message);
    }
  };

  useEffect(() => {
    setMessages([]);
    getMessages();
    readAllMessages();
  }, []);

  useEffect(() => {
    conversation?.isPopup && getMessages();
  }, [page]);

  useEffect(() => {
    socket &&
      socket?.on("getMessage", (mess) => {
        mess && mess?.type == "message" && setArrivalMessage(mess);
      });
  }, [socket]);

  useEffect(() => {
    if (arrivalMessage && arrivalMessage?.target == conversation?._id) {
      setMessages([...messages, arrivalMessage]);
      new Audio(msg_sound).play();
    }
  }, [arrivalMessage]);

  const readAllMessages = async () => {
    try {
      await ConversationsServices.readAllMessages(conversation?._id);
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
    <div
      className="h-full w-80 bg-white border rounded-lg pointer-events-auto relative"
      style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px" }}
    >
      <div className=" border-b flex justify-between">
        <div className="flex gap-2 items-center hover:bg-neutral-100 p-2 rounded-md cursor-pointer">
          <div className="relative">
            <img className="w-10 h-10 rounded-full" src={conversation?.receiver?.image} alt="" />
            {usersOnline?.find((u) => u?._id == conversation?.receiver?._id) && (
              <span className="bottom-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></span>
            )}
          </div>
          <div>
            <p className="font-semibold">{conversation?.receiver?.display_name}</p>
            <p className="text-xs text-neutral-400">
              {usersOnline?.find((u) => u?._id == conversation?.receiver?._id) ? "Đang hoạt động" : "Đang offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center pr-2">
          <div className=" cursor-pointer p-1 rounded-full hover:bg-neutral-100">
            <HiOutlineVideoCamera className="w-6 h-6 text-neutral-400" />
          </div>
          <div className=" cursor-pointer p-1 rounded-full hover:bg-neutral-100">
            <HiOutlinePhone className="w-6 h-6 text-neutral-400" />
          </div>
          <div
            className=" cursor-pointer p-1 rounded-full hover:bg-neutral-100"
            onClick={() => {
              showConversation(conversation?._id);
            }}
          >
            <AiOutlineLine className="w-6 h-6 text-neutral-400" />
          </div>
          <div
            className=" cursor-pointer p-1 rounded-full hover:bg-neutral-100"
            onClick={() => {
              closeConversation(conversation?._id);
            }}
          >
            <AiOutlineClose className="w-6 h-6 text-neutral-400" />
          </div>
        </div>
      </div>

      <div
        className="px-2 h-[calc(450px-125px)] overflow-y-auto bg-[#f8f8fc]"
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
      <div className="w-full px-2 border-t absolute bottom-2 bg-white">
        <AnswerInput
          placeholder={"Viết tin nhắn ..."}
          isMini
          loading={loadingSend}
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
