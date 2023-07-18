import { Avatar, Modal, Tabs } from "antd";
import React, { useState } from "react";
import Priority from "../../components/priority";
import { HiOutlineUser, HiUsers } from "react-icons/hi2";
import { MdDateRange } from "react-icons/md";
import { FiClipboard } from "react-icons/fi";
import { TbFileDescription } from "react-icons/tb";
import { BiCommentDetail, BiAddToQueue } from "react-icons/bi";
import { GoPaperclip } from "react-icons/go";
import AvatarUi from "../../components/avatar";
import { AnswerInput, AnswerComment } from "../../components/post/Comment";
import File from "../../components/file";

const Detail = ({ id, show, setShow }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const items = [
    {
      key: "1",
      label: (
        <div className="flex ">
          <TbFileDescription className="w-5 h-5 mr-1" />
          <span>Mô tả</span>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div className="flex ">
          <BiCommentDetail className="w-5 h-5 mr-1" />
          <span>Bình luận</span>
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div className="flex ">
          <GoPaperclip className="w-5 h-5 mr-1" />
          <span>Tài liệu đính kèm</span>
        </div>
      ),
    },
    {
      key: "4",
      label: (
        <div className="flex ">
          <BiAddToQueue className="w-5 h-5 mr-1" />
          <span>Công việc con</span>
        </div>
      ),
    },
  ];
  const [activeTab, setActiveTab] = useState(1);
  const onChangeTab = (key) => {
    setActiveTab(key);
  };
  return (
    <Modal
      title={
        <div className="flex items-center justify-center gap-2 border-b pb-2 border-gray-300">
          <p className="font-bold text-lg text-center">Công việc của Bình</p>
        </div>
      }
      open={show}
      footer={null}
      centered
      onCancel={() => setShow(false)}
      width={650}
    >
      <div className="p-3  min-h-[700px] max-h-[1200px] overflow-y-auto h-[810px]">
        <div className="flex items-center justify-between">
          <Priority id={1} hasTitle onChange />
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <HiUsers className="w-5 h-5" />
              <p className="font-semibold">Người tham gia</p>
            </div>
            <Avatar.Group>
              <AvatarUi data={{ name: "Bình" }} />
              <AvatarUi />
              <AvatarUi />
              <Avatar className="bg-gray-400 cursor-pointer">+2</Avatar>
            </Avatar.Group>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5">
          <div className="flex items-center gap-2">
            <HiOutlineUser className="w-5 h-5" />
            <p className="font-semibold">Người giao việc</p>
          </div>

          <div className="flex items-center gap-2">
            <AvatarUi />
            <a>Lê Văn Bình</a>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-5">
          <div className="flex items-center gap-2">
            <HiOutlineUser className="w-5 h-5" />
            <p className="font-semibold">Người nhận việc</p>
          </div>

          <div className="flex items-center gap-2">
            <AvatarUi />
            <a>Lê Văn Bình</a>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-5">
          <div className="flex items-center gap-2">
            <MdDateRange className="w-5 h-5" />
            <p className="font-semibold">Thời gian</p>
          </div>

          <div className="flex items-center gap-2">
            <p> 01/02/2003</p>
            <p>- 01/02/2003</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-5 mb-3">
          <div className="flex items-center gap-2">
            <FiClipboard className="w-5 h-5" />
            <p className="font-semibold">Trạng thái</p>
          </div>
          <p className="font-bold text-green-500">Đã hoàn thành</p>
        </div>
        <Tabs
          defaultActiveKey="1"
          items={items}
          onChange={onChangeTab}
          centered
        />

        {activeTab == 1 && <DescTab />}
        {activeTab == 2 && <CommentTab />}
        {activeTab == 3 && <AttachmentTab />}
        {activeTab == 4 && <SubTaskTab />}
      </div>
    </Modal>
  );
};

export default Detail;

const DescTab = () => {
  return <div className="p-3">Đây là mô tả</div>;
};
const CommentTab = () => {
  return (
    <div className="p-3 ">
      <div className="max-h-[395px] min-h-[395px] overflow-y-auto">
        <div className="flex items-start gap-2 mt-2">
          <Avatar
            className="border border-black"
            size={40}
            src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1"
          />
          <div className="flex flex-col w-full">
            <div className="px-3 py-2 bg-[#f0f2f5] rounded-2xl w-fit">
              <div className="flex items-center gap-2">
                <a className="font-semibold hover:underline text-black cursor-pointer hover:text-black">
                  Trần Minh Nhật
                </a>
                <p className="font-semibold hover:underline text-xs cursor-pointer text-gray-500">
                  37 phút
                </p>
              </div>

              <p dangerouslySetInnerHTML={{ __html: "hello" }} />
            </div>
          </div>
        </div>
      </div>
      <div>
        <AnswerInput />
      </div>
    </div>
  );
};
const AttachmentTab = () => {
  return (
    <div className="p-3 max-h-[450px] min-h-[450px] overflow-y-auto">
      <File />
    </div>
  );
};
const SubTaskTab = () => {
  return <div className="p-3"></div>;
};
