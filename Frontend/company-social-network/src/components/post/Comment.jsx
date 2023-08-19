import { Avatar, Tooltip } from "antd";
import { Input } from "antd";
import React, { useEffect, useState } from "react";
import { PiArrowBendUpLeftBold, PiPaperPlaneRightFill } from "react-icons/pi";
import { BsImageFill } from "react-icons/bs";
import { MdEmojiEmotions } from "react-icons/md";
import DetailPost from "./DetailPost";
import { useRootState } from "../../store";
import PostServices from "../../services/postServices";
import CommentServices from "../../services/commentServices";
import { timeAgo } from "../../helper/timeHelper";
import UploadImage from "../uploadImage";

const { TextArea } = Input;

const Comment = ({ id, onCommentSuccess }) => {
  const [show, setShow] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const getComments = async () => {
    const res = await CommentServices.getComments({ "target[eq]": id, sort: "-created_at", limit: 1 });
    setComments(res.data);
  };
  const onComment = async () => {
    setLoading(true);
    const body = {
      content,
      attachments,
    };
    try {
      const res = await PostServices.commentPost(id, body);
      setComments([...comments, res?.data]);
      setContent("");
      setAttachments([]);
      onCommentSuccess && onCommentSuccess(res?.data?._id);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getComments();
  }, []);
  return (
    <div className="mt-2">
      {comments?.length > 0 && (
        <p
          className="font-semibold hover:underline text-sm cursor-pointer"
          onClick={() => {
            setShow(true);
          }}
        >
          Xem thêm bình luận
        </p>
      )}

      {comments?.map((comment) => {
        return (
          <AnswerComment
            hasShowMore
            comment={comment}
            key={comment?._id}
            setComments={setComments}
            comments={comments}
          />
        );
      })}

      <div className="w-full">
        <AnswerInput
          loading={loading}
          content={content}
          setContent={setContent}
          onComment={onComment}
          files={attachments}
          setFiles={setAttachments}
        />
      </div>
      <DetailPost show={show} setShow={setShow} id={id} />
    </div>
  );
};

export default Comment;

export const AnswerComment = ({ hasShowMore, comment, setComments, comments }) => {
  const [isAnswerComment, setIsAnswerComment] = useState(false);
  const [isShowMoreComment, setIshowMoreComment] = useState(false);
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const onComment = async () => {
    setLoading(true);
    const body = {
      content,
      attachments,
    };
    try {
      const res = await PostServices.answerCommentPost(comment?._id, body);
      const newComments = comments.map((c) => {
        if (c?._id == comment?._id) {
          return { ...c, answers: [...c.answers, res?.data] };
        } else return c;
      });
      setComments(newComments);
      setIshowMoreComment(true);
      setContent("");
      setAttachments([]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-start gap-2 mt-2">
      <Avatar className="border border-black" size={40} src={comment?.created_by?.image} />
      <div className="flex flex-col w-full">
        <div className="px-3 py-2 bg-[#f0f2f5] rounded-2xl w-fit">
          <a className="font-semibold hover:underline text-black cursor-pointer hover:text-black">
            {comment?.created_by?.display_name}
          </a>
          <p dangerouslySetInnerHTML={{ __html: comment?.content }} />
        </div>
        <div className="flex items-center gap-3 ml-2">
          <p
            className="font-semibold hover:underline text-sm cursor-pointer"
            onClick={() => {
              setIsAnswerComment(!isAnswerComment);
            }}
          >
            Phản hồi
          </p>
          <p className="font-semibold hover:underline text-xs cursor-pointer text-gray-500">
            {timeAgo(comment?.created_at)}
          </p>
        </div>
        {hasShowMore && comment?.answers?.length > 0 && (
          <div className="flex items-center gap-3 mt-2 ml-3">
            <PiArrowBendUpLeftBold className="rotate-180" />
            <p
              className="font-semibold hover:underline text-sm cursor-pointer"
              onClick={() => {
                setIshowMoreComment(!isShowMoreComment);
              }}
            >
              {isShowMoreComment ? "Thu gọn phản hồi" : " Xem tất cả phản hồi"}
            </p>
          </div>
        )}
        {isShowMoreComment && (
          <div>
            {comment?.answers?.map((comment) => {
              return <AnswerComment comment={comment} key={comment?._id} noReply />;
            })}
          </div>
        )}

        {isAnswerComment && (
          <div className="w-full">
            <AnswerInput
              loading={loading}
              content={content}
              setContent={setContent}
              onComment={onComment}
              files={attachments}
              setFiles={setAttachments}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const AnswerInput = ({ content, setContent, onComment, loading, files, setFiles }) => {
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
            onKeyDown={(e) => {
              if (e?.key == "Enter" && !e.shiftKey) {
                e.preventDefault();
                !loading && onComment();
              }
            }}
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
      <div className="flex gap-4 mt-1 ml-16">
        <MdEmojiEmotions className="w-5 h-5 cursor-pointer" color="#1b74e4" />
        <div className="flex-1">
          <UploadImage
            files={files ?? []}
            setFiles={setFiles}
            customButton={<BsImageFill className="w-5 h-5 cursor-pointer" color="#1b74e4" />}
          />
        </div>
      </div>
    </div>
  );
};
