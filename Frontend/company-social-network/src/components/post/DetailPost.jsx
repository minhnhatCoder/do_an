import { Modal } from "antd";
import React, { useState } from "react";
import UserLiked from "./UserLiked";
import { AiOutlineLike, AiTwotoneLike } from "react-icons/ai";
import { GoCommentDiscussion } from "react-icons/go";
import { AnswerComment, AnswerInput } from "./Comment";

const DetailPost = ({ show, setShow, id }) => {
  const [isShowUserLiked, setIsShowUserLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const getPost = async () => {
    setLoading(true);
  };
  return (
    <Modal
      title={
        <div className="flex items-center justify-center gap-2 border-b pb-2 border-gray-300">
          <p className="font-bold text-lg text-center">Bài viết của nhật</p>
        </div>
      }
      open={show}
      footer={null}
      centered
      onCancel={() => setShow(false)}
      width={750}
    >
      <div>
        <div className="flex flex-col gap-2 min-h-[700px] max-h-[1000px] overflow-y-auto h-[350px] p-3 hide-scroll">
          <img
            src="https://gaixinhbikini.com/wp-content/uploads/2022/09/52322459440_fa16f4c604_o.jpg"
            className="w-full h-[450px] bg-contain rounded-lg"
          />
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
            <p className="font-light text-sm text-gray-500 hover:underline cursor-pointer">6 bình luận</p>
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
          </div>
          <UserLiked show={isShowUserLiked} setShow={setIsShowUserLiked} />
          <AnswerComment hasShowMore isDetailPost />
        </div>
        <AnswerInput />
      </div>
    </Modal>
  );
};

export default DetailPost;
