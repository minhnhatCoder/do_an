import { Avatar, Tooltip, Modal, Button } from "antd";
import React, { useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { GoCommentDiscussion } from "react-icons/go";
import { BiShare } from "react-icons/bi";
import { AiOutlineGlobal, AiOutlineLike, AiTwotoneLike } from "react-icons/ai";
import Comment from "./Comment";
import UserLiked from "./UserLiked";

const Post = () => {
  const [isShowUserLiked, setIsShowUserLiked] = useState(false);
  return (
    <div className="py-3 px-5 rounded-lg bg-white box_shadow-light w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center gap-2">
          <Avatar
            className="border border-black"
            size={40}
            src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <a className="font-semibold hover:underline text-black cursor-pointer hover:text-black">
                Trần Minh Nhật{" "}
              </a>
              <span className="font-light text-gray-500">
                đã cập nhật ảnh đại diện của anh ấy
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Tooltip placement="bottom" title="Ngày 1 tháng 5 năm 2023">
                <p className="font-light text-gray-500">1 tháng 5</p>
              </Tooltip>

              <Tooltip placement="bottom" title="Công khai">
                <AiOutlineGlobal className="w-4 h-4" color="#606770" />
              </Tooltip>
            </div>
          </div>
        </div>

        <FiMoreHorizontal className="w-8 h-8" />
      </div>
      <div className="flex items-center justify-around mt-3">
        <img
          src="https://gaixinhbikini.com/wp-content/uploads/2022/09/52322459440_fa16f4c604_o.jpg"
          className="w-full h-[450px] bg-contain rounded-lg"
        />
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center justify-center gap-2">
          <AiTwotoneLike className="w-5 h-5" color="#1b74e4" />
          <p
            className="font-light text-sm text-gray-500 hover:underline cursor-pointer"
            onClick={() => setIsShowUserLiked(true)}
          >
            Bạn, Ngô Văn Trung, Lê Văn Bình và 18 người khác
          </p>
        </div>
        <p className="font-light text-sm text-gray-500 hover:underline cursor-pointer">
          6 bình luận
        </p>
      </div>
      <div className="flex items-center justify-center gap-4 mt-3 border-t border-b border-gray-300 py-2">
        <div className="flex items-center justify-center gap-2 cursor-pointer w-1/3 p-2 hover:bg-gray-100 rounded-lg">
          <AiOutlineLike className="w-7 h-7" color="#606770" />
          <a className="font-semibold text-gray-500">Thích</a>
        </div>
        <div className="flex items-center justify-center gap-2 cursor-pointer w-1/3 p-2 hover:bg-gray-100 rounded-lg">
          <GoCommentDiscussion className="w-7 h-7" color="#606770" />
          <a className="font-semibold text-gray-500">Bình luận</a>
        </div>
        <div className="flex items-center justify-center gap-2 cursor-pointer w-1/3 p-2 hover:bg-gray-100 rounded-lg">
          <BiShare className="w-7 h-7" color="#606770" />
          <a className="font-semibold text-gray-500">Chia sẻ</a>
        </div>
      </div>
      {/* commnet */}
      <Comment />
      <UserLiked show={isShowUserLiked} setShow={setIsShowUserLiked} />
    </div>
  );
};

export default Post;
