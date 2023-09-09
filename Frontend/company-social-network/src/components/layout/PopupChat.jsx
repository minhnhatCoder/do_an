import React, { useState } from "react";
import usePopupChatStore from "../../store/popupChatStore";
import { useRootState } from "../../store";
import { AiOutlineCloseCircle } from "react-icons/ai";

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

  return (
    <div className="absolute bottom-6 right-4">
      <div className="flex items-center justify-center gap-2 flex-col">
        {conversations.map((item, index) => {
          return (
            <div key={index} className="relative cursor-pointer">
              <img className="w-14 h-14 rounded-full" src={item?.receiver?.image} alt="" />
              {usersOnline?.find((u) => u?._id == i?._id) && (
                <span className="bottom-0 left-11 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></span>
              )}

              <span
                className="top-0 left-10 absolute  w-5 h-5 rounded-full bg-white"
                onClick={() => {
                  closeConversation(item);
                }}
              >
                <AiOutlineCloseCircle className="w-5 h-5" />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PopupChat;
