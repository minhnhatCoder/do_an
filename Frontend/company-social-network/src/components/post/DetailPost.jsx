import { Modal, Spin } from "antd";
import React, { useEffect, useRef, useState } from "react";
import UserLiked from "./UserLiked";
import { AiOutlineLike, AiTwotoneLike } from "react-icons/ai";
import { GoCommentDiscussion } from "react-icons/go";
import { AnswerComment, AnswerInput } from "./Comment";
import PostServices from "../../services/postServices";
import { useRootState } from "../../store";
import CommentServices from "../../services/commentServices";

const DetailPost = ({ show, setShow, id }) => {
  const [isShowUserLiked, setIsShowUserLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState({});
  const userInfo = useRootState((state) => state.userInfo);
  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const scrollRef = useRef(null);

  const getPost = async () => {
    setLoading(true);
    try {
      const res = await PostServices.getPost(id);
      setPost(res?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const onLikePost = async () => {
    try {
      const { data } = await PostServices.likePost(post?._id);
      setPost({ ...post, liked_user: data?.liked_user });
    } catch (error) {
      console.log(error);
    }
  };
  const handleShowLikedUser = () => {
    if (post?.liked_user?.length < 2) {
      return post?.liked_user?.[0]?.display_name;
    } else {
      let newUser = post?.liked_user
        ?.sort((a, b) => {
          if (a._id === userInfo?._id && b._id !== userInfo?._id) {
            return -1; // a nằm trước b
          } else if (a._id !== userInfo?._id && b._id === userInfo?._id) {
            return 1; // b nằm trước a
          }
          return 0; // giữ nguyên thứ tự
        })
        ?.map((u) => {
          if (u?._id == userInfo?._id) {
            return "Bạn";
          } else return u?.display_name;
        });
      const newContent = newUser.splice(0, 2)?.toString();
      const extraContent = newUser?.length > 2 ? `và ${newUser.length - 2} người khác đã thích bài viết` : "";
      return newContent + extraContent;
    }
  };

  const getComments = async () => {
    const res = await CommentServices.getComments({ "target[eq]": id, sort: "-created_at", limit: 10 });
    setComments(res.data.sort((a, b) => a.created_at - b.created_at));
  };
  const onComment = async () => {
    const body = {
      content,
      attachments,
    };
    try {
      const res = await PostServices.commentPost(id, body);
      setComments([...comments, res?.data]);
      setContent("");
      setAttachments([]);
      setPost({ ...post, comments: [...post.comments, res?.data?._id] });
      scrollToBottom();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (show && id) {
      getComments();
      getPost();
    }
  }, [show]);
  const scrollToBottom = () => {
    if (scrollRef.current) {
      const innerElement = scrollRef.current.lastChild;
      if (innerElement) {
        innerElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [comments?.length]);
  return (
    <Modal
      title={
        <div className="flex items-center justify-center gap-2 border-b pb-2 border-gray-300">
          <p className="font-bold text-lg text-center">Bài viết của {post?.created_user?.display_name}</p>
        </div>
      }
      open={show}
      footer={null}
      centered
      onCancel={() => setShow(false)}
      width={750}
    >
      <Spin spinning={loading}>
        <div>
          <div className="flex flex-col gap-2 min-h-[700px] max-h-[1000px] overflow-y-auto p-3 hide-scroll">
            <img src={post?.attachments?.[0]?.url} className="w-full h-[450px] bg-contain rounded-lg" />
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center justify-center gap-2">
                {post?.liked_user?.length > 0 ? (
                  <div className="flex items-center justify-center gap-2">
                    <AiTwotoneLike className="w-5 h-5" color="#1b74e4" />
                    <p
                      className="font-light text-sm text-gray-500 hover:underline cursor-pointer"
                      onClick={() => setIsShowUserLiked(true)}
                    >
                      {handleShowLikedUser()}
                    </p>
                  </div>
                ) : (
                  <div />
                )}
              </div>
              {post?.comments?.length > 0 ? (
                <p className="font-light text-sm text-gray-500 hover:underline cursor-pointer">
                  {post?.comments?.length} bình luận
                </p>
              ) : (
                <div />
              )}
            </div>
            <div className="flex items-center justify-center gap-4 mt-3 border-t border-b border-gray-300 py-2">
              <div
                className="flex items-center justify-center gap-2 cursor-pointer w-1/3 p-2 hover:bg-gray-100 rounded-lg"
                onClick={onLikePost}
              >
                {post?.liked_user?.find((u) => u?._id == userInfo?._id) ? (
                  <AiTwotoneLike className="w-7 h-7" color="#1b74e4" />
                ) : (
                  <AiOutlineLike className="w-7 h-7" color="#606770" />
                )}

                <a className="font-semibold text-gray-500">Thích</a>
              </div>
              <div className="flex items-center justify-center gap-2 cursor-pointer w-1/3 p-2 hover:bg-gray-100 rounded-lg">
                <GoCommentDiscussion className="w-7 h-7" color="#606770" />
                <a className="font-semibold text-gray-500">Bình luận</a>
              </div>
            </div>
            <UserLiked show={isShowUserLiked} setShow={setIsShowUserLiked} data={post?.liked_user} />
            <div className="max-h-[850px] min-h-[250px] h-[700px] overflow-y-auto" ref={scrollRef}>
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
            </div>
          </div>
          <AnswerInput loading={loading} content={content} setContent={setContent} onComment={onComment} />
        </div>
      </Spin>
    </Modal>
  );
};

export default DetailPost;
