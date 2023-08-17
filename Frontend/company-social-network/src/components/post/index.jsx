import { Avatar, Tooltip, Modal, Button } from "antd";
import React, { useEffect, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { GoCommentDiscussion } from "react-icons/go";
import { BiShare, BiSolidLock } from "react-icons/bi";
import { AiOutlineGlobal, AiOutlineLike, AiTwotoneLike } from "react-icons/ai";
import Comment from "./Comment";
import UserLiked from "./UserLiked";
import { Link } from "react-router-dom";
import { getDayOfTimeStamp, getFullTimeFormatted, getMonthOfTimeStamp } from "../../helper/timeHelper";
import { ImEarth } from "react-icons/im";
import { HiUsers } from "react-icons/hi";
import { FaUsers } from "react-icons/fa";
import { useRootState } from "../../store";
import PostServices from "../../services/postServices";

const Post = ({ post, setPost, posts }) => {
  const [isShowUserLiked, setIsShowUserLiked] = useState(false);
  const userInfo = useRootState((state) => state.userInfo);
  const onLikePost = async () => {
    try {
      const { data } = await PostServices.likePost(post?._id);
      setPost((prev) =>
        prev?.map((p) => {
          if (p?._id == post?._id) {
            return {
              ...p,
              liked_user: data?.liked_user,
            };
          } else {
            return p;
          }
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
  const handleShowLikedUser = () => {
    if (post?.liked_user?.length < 2) {
      return post?.liked_user?.[0]?.display_name;
    } else {
      const filterMax2Peple = post?.liked_user?.post?.liked_user
        ?.filter((u) => u?._id != userInfo?._id)
        ?.filter((_, index) => {
          return index < 2;
        })
        ?.map((u) => u.display_name);
      if (post?.liked_user?.length?.includes(userInfo?._id)) {
        return (
          `Bạn,` + filterMax2Peple.toString() + post?.liked_user?.length > 3 &&
          `và ${post?.liked_user?.length - 3} người khác`
        );
      } else {
        return (
          filterMax2Peple.toString() + post?.liked_user?.length > 2 && `và ${post?.liked_user?.length - 3} người khác`
        );
      }
    }
  };

  const onComment = (id) => {
    post.comments.push(id);
    setPost([...posts]);
  };

  return (
    <div className="py-3 px-5 rounded-lg bg-white box_shadow-light w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center gap-2">
          <Avatar className="border border-black" size={40} src={post?.created_user?.image} />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Link
                className="font-semibold hover:underline text-black cursor-pointer hover:text-black"
                to={`/profile/${post?.created_user?._id}`}
              >
                {post?.created_user?.display_name}{" "}
              </Link>
              {post?.title && <span className="font-light text-gray-500">{post?.title}</span>}
            </div>

            <div className="flex items-center gap-2">
              <Tooltip placement="bottom" title={getFullTimeFormatted(post?.created_at, true)}>
                <p className="font-light text-gray-500 text-sm">
                  {getDayOfTimeStamp(post?.created_at)} tháng {getMonthOfTimeStamp(post?.created_at)}
                </p>
              </Tooltip>

              <Tooltip
                placement="bottom"
                title={
                  post?.show_type == 0
                    ? "Công khai"
                    : post?.show_type == 1
                    ? "Chỉ mình tôi"
                    : post?.show_type == 2
                    ? "Bạn bè"
                    : "Phòng ban hoặc cá nhân"
                }
              >
                {post?.show_type == 0 ? (
                  <ImEarth className="w-4 h-4" />
                ) : post?.show_type == 1 ? (
                  <BiSolidLock className="w-4 h-4" />
                ) : post?.show_type == 2 ? (
                  <HiUsers className="w-4 h-4" />
                ) : (
                  <FaUsers className="w-4 h-4" />
                )}
              </Tooltip>
            </div>
          </div>
        </div>

        <FiMoreHorizontal className="w-8 h-8" />
      </div>
      <div className="flex items-center justify-around mt-3">
        <img src={post?.attachments?.[0]?.url} className="w-full h-[450px] bg-contain rounded-lg object-cover" />
      </div>
      <div className="flex items-center justify-between mt-4">
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
        <div className="flex items-center justify-center gap-2 cursor-pointer w-1/3 p-2 hover:bg-gray-100 rounded-lg">
          <BiShare className="w-7 h-7" color="#606770" />
          <a className="font-semibold text-gray-500">Chia sẻ</a>
        </div>
      </div>
      {/* comment */}
      <Comment id={post?._id} onCommentSuccess={onComment} />
      <UserLiked show={isShowUserLiked} setShow={setIsShowUserLiked} data={post?.liked_user} />
    </div>
  );
};

export default Post;
