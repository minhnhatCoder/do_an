import { Avatar, Button, Modal } from "antd";
import { BsPersonPlusFill, BsMessenger } from "react-icons/bs";
import React from "react";
import { AiTwotoneLike } from "react-icons/ai";
import { useRootState } from "../../store";

const UserLiked = ({ show, setShow, data }) => {
  const userInfo = useRootState((state) => state.userInfo);

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
              {userInfo?._id != u?._id && (
                <Button type="primary" icon={<BsMessenger />} size="large" className="flex items-center justify-center">
                  Nhắn tin
                </Button>
              )}

              {/* <Button
          type="primary"
          icon={<BsPersonPlusFill />}
          size="large"
          className="flex items-center justify-center"
        >
          Thêm bạn bè
        </Button> */}
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default UserLiked;
