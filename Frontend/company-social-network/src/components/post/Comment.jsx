import { Avatar, Tooltip } from "antd";
import { Input } from "antd";
import React, { useState } from "react";
import { PiArrowBendUpLeftBold, PiPaperPlaneRightFill } from "react-icons/pi";
import { BsImageFill } from "react-icons/bs";
import { MdEmojiEmotions } from "react-icons/md";
import DetailPost from "./DetailPost";
import { useRootState } from "../../store";
const { TextArea } = Input;

const Comment = () => {
  const [show, setShow] = useState(false);
  return (
    <div className="mt-2">
      <p
        className="font-semibold hover:underline text-sm cursor-pointer"
        onClick={() => {
          setShow(true);
        }}
      >
        Xem thêm bình luận
      </p>
      <AnswerComment setShow={setShow} hasShowMore />
      <div className="w-full">
        <AnswerInput />
      </div>
      <DetailPost show={show} setShow={setShow} />
    </div>
  );
};

export default Comment;

export const AnswerComment = ({ setShow, hasShowMore, isDetailPost }) => {
  const [isAnswerComment, setIsAnswerComment] = useState(false);
  const [isShowMoreComment, setIshowMoreComment] = useState(false);

  return (
    <div className="flex items-start gap-2 mt-2">
      <Avatar className="border border-black" size={40} src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
      <div className="flex flex-col w-full">
        <div className="px-3 py-2 bg-[#f0f2f5] rounded-2xl w-fit">
          <a className="font-semibold hover:underline text-black cursor-pointer hover:text-black">Trần Minh Nhật</a>
          <p dangerouslySetInnerHTML={{ __html: "hello" }} />
        </div>
        <div className="flex items-center gap-3 ml-2">
          <p
            className="font-semibold hover:underline text-sm cursor-pointer"
            onClick={() => {
              isDetailPost ? true : setIsAnswerComment(!isAnswerComment);
            }}
          >
            Phản hồi
          </p>
          <p className="font-semibold hover:underline text-xs cursor-pointer text-gray-500">37 phút</p>
        </div>
        {hasShowMore && (
          <div className="flex items-center gap-3 mt-2 ml-3">
            <PiArrowBendUpLeftBold className="rotate-180" />
            <p
              className="font-semibold hover:underline text-sm cursor-pointer"
              onClick={() => {
                setShow ? setShow(true) : setIshowMoreComment(!isShowMoreComment);
              }}
            >
              Xem tất cả phản hồi
            </p>
          </div>
        )}
        {isShowMoreComment && <AnswerComment />}

        {isAnswerComment && (
          <div className="w-full">
            <AnswerInput />
          </div>
        )}
      </div>
    </div>
  );
};

export const AnswerInput = ({ content, setContent, onComment, loading }) => {
  const currentUser = useRootState((state) => state.userInfo);
  return (
    <div>
      <div className="flex items-center justify-center gap-2 mt-2 w-full">
        <Tooltip title={currentUser?.display_name}>
          <Avatar className="border border-black" size={40} src={currentUser?.image} />
        </Tooltip>

        <div className="flex-1">
          <TextArea
            placeholder="Viết bình luận"
            className="rounded-2xl px-4 py-1"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            autoSize={{
              minRows: 1,
              maxRows: 3,
            }}
            onKeyDown={(e) => e.key == "Enter" && !loading && onComment()}
          />
        </div>
        <PiPaperPlaneRightFill
          className="w-7 h-7 cursor-pointer"
          color="#1b74e4"
          onClick={() => {
            !loading && onComment();
          }}
        />
      </div>
      <div className="flex gap-4 mt-1 items-center ml-16">
        <BsImageFill className="w-5 h-5 cursor-pointer" color="#1b74e4" />
        <MdEmojiEmotions className="w-5 h-5 cursor-pointer" color="#1b74e4" />
      </div>
    </div>
  );
};
