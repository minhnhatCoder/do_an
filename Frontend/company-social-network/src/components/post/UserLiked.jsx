import { Avatar, Button, Modal } from "antd";
import { BsPersonPlusFill, BsMessenger } from "react-icons/bs";
import React from "react";
import { AiTwotoneLike } from "react-icons/ai";
import { useRootState } from "../../store";
import UserServices from "../../services/user";
import Toast from "../noti";
import ConversationsServices from "../../services/conversationServies";
import { useNavigate } from "react-router-dom";

const UserLiked = ({ show, setShow, data }) => {
  const userInfo = useRootState((state) => state.userInfo);
  const navigate = useNavigate();
  const sendRequestFriend = async (id) => {
    try {
      const res = await UserServices.sendFriendRequest({
        receiver: id,
      });
      Toast("success", res?.message);
    } catch (error) {
      Toast("error", error?.message);
    }
  };
  const onMessage = async (params) => {
    try {
      const res = await ConversationsServices.getConversations(params);
      if (res?.data?.length > 0) {
        navigate("/chat/" + res?.data?.[0]?._id);
      } else {
        const newConversation = await ConversationsServices.postConversation({
          participants: params["participants[all]"],
        });
        navigate("/chat/" + newConversation?.data?._id);
      }
    } catch (error) {
      console.log(error?.message);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 border-b pb-2 border-gray-300">
          <AiTwotoneLike className="w-5 h-5" color="#1b74e4" />
          <p className="font-bold text-sm ">Những người đã thích bài viết của bạn</p>
        </div>
      }
      open={show}
      footer={null}
      centered
      onCancel={() => setShow(false)}
    >
      <div className="flex flex-col gap-2 min-h-[300px] max-h-[500px] overflow-y-auto h-[350px] pr-2">
        {data?.map((u) => {
          return (
            <div className="flex items-center justify-between" key={u?._id}>
              <div className="flex items-center gap-2">
                <Avatar className="border border-black" size={40} src={u?.image} />
                <a className="font-semibold hover:underline text-black cursor-pointer hover:text-black">
                  {u?.display_name}
                </a>
              </div>
              {userInfo?._id == u?._id ? null : userInfo?.friends?.find((f) => u?._id == f?._id) ? (
                <Button
                  type="primary"
                  icon={<BsMessenger />}
                  size="large"
                  className="flex items-center justify-center"
                  onClick={() => onMessage({ "participants[all]": [userInfo?._id, u?._id], "type:eq": "personal" })}
                >
                  Nhắn tin
                </Button>
              ) : (
                <Button
                  type="primary"
                  icon={<BsPersonPlusFill />}
                  size="large"
                  className="flex items-center justify-center"
                  onClick={() => {
                    sendRequestFriend(u?._id);
                  }}
                >
                  Thêm bạn bè
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default UserLiked;
