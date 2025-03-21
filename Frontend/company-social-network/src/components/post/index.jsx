import { Avatar, Tooltip, Modal, Button, Dropdown, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { GoCommentDiscussion } from "react-icons/go";
import { BiShare, BiSolidLock } from "react-icons/bi";
import {
  AiOutlineEdit,
  AiOutlineGlobal,
  AiOutlineLike,
  AiTwotoneLike,
} from "react-icons/ai";
import Comment from "./Comment";
import UserLiked from "./UserLiked";
import { Link } from "react-router-dom";
import {
  getDayOfTimeStamp,
  getFullTimeFormatted,
  getMonthOfTimeStamp,
} from "../../helper/timeHelper";
import { ImEarth } from "react-icons/im";
import { HiUsers } from "react-icons/hi";
import { FaUsers } from "react-icons/fa";
import { useRootState } from "../../store";
import PostServices from "../../services/postServices";
import DetailPost from "./DetailPost";
import useSocketStore from "../../store/socketStore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "react-image-resizer";
import { BsTrash } from "react-icons/bs";
import UploadPost from "../uploadPost";
import Toast from "../noti";

const Post = ({ post, setPost, posts }) => {
  const [isShowUserLiked, setIsShowUserLiked] = useState(false);
  const socket = useSocketStore((state) => state.socket);
  const userInfo = useRootState((state) => state.userInfo);
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [id, setId] = useState(0);

  const cbSuccess = (data) => {
    setPost((prev) =>
      prev?.map((p) => {
        if (p?._id == data?._id) {
          return {
            ...p,
            content: data?.content,
            show_type: data?.show_type,
            attachments: data?.attachments,
          };
        } else {
          return p;
        }
      })
    );
  };

  const onLikePost = async () => {
    try {
      const { data } = await PostServices.likePost(post?._id);
      if (
        post?.created_user?._id != userInfo?._id &&
        data?.liked_user?.find((u) => u?._id == userInfo?._id)
      ) {
        socket.emit("sendNotification", {
          userIds: [post?.created_user?._id],
          data: {
            content: `${userInfo?.display_name} đã thích bài viết của bạn`,
          },
        });
      }

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
      const extraContent =
        newUser?.length > 2
          ? `và ${newUser.length - 2} người khác đã thích bài viết`
          : "";
      return newContent + extraContent;
    }
  };

  const onComment = (id) => {
    post.comments.push(id);
    if (post?.created_user?._id != userInfo?._id) {
      socket.emit("sendNotification", {
        userIds: [post?.created_user?._id],
        data: {
          content: `${userInfo?.display_name} đã bình luận bài viết`,
        },
      });
    }
    setPost([...posts]);
  };

  const handleDelete = async (id) => {
    try {
      const res = PostServices.deletePost(id);
      setPost((prev) => prev?.filter((p) => p?._id !== id));
      Toast("success", res?.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="py-3 px-5 rounded-lg bg-white border w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center gap-2">
          <Avatar
            className="border border-black"
            size={40}
            src={post?.created_user?.image}
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Link
                className="font-semibold hover:underline text-black cursor-pointer hover:text-black"
                to={`/profile/${post?.created_user?._id}`}
              >
                {post?.created_user?.display_name}{" "}
              </Link>
              {post?.title && (
                <span className="font-light text-gray-500">{post?.title}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Tooltip
                placement="bottom"
                title={getFullTimeFormatted(post?.created_at, true)}
              >
                <p className="font-light text-gray-500 text-sm">
                  {getDayOfTimeStamp(post?.created_at)} tháng{" "}
                  {getMonthOfTimeStamp(post?.created_at)}
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

        {post?.created_user?._id == userInfo?._id ? (
          <Dropdown
            trigger={"click"}
            placement="bottom"
            menu={{
              items: [
                {
                  key: "1",
                  label: (
                    <p
                      className="font-semibold"
                      onClick={() => {
                        setId(post?._id);
                        setShowEdit(true);
                      }}
                    >
                      Sửa bài viết
                    </p>
                  ),
                  icon: <AiOutlineEdit className="w-5 h-5" />,
                },
                {
                  key: "2",
                  label: (
                    <Popconfirm
                      title="Bạn có chắc chắn muốn xóa?"
                      onConfirm={() => handleDelete(post?._id)}
                    >
                      <div className="flex items-center gap-2">
                        <BsTrash className="w-5 h-5" />
                        <p className="font-semibold">Xóa bài viết</p>
                      </div>
                    </Popconfirm>
                  ),
                },
              ],
            }}
          >
            <FiMoreHorizontal className="w-8 h-8 cursor-pointer text-neutral-500 hover:text-neutral-900" />
          </Dropdown>
        ) : null}
      </div>
      <div
        className="mt-3"
        dangerouslySetInnerHTML={{ __html: post?.content }}
      />
      <Swiper spaceBetween={50} navigation={true} modules={[Navigation]}>
        {post?.attachments?.map((image, index) => {
          return (
            <SwiperSlide key={index}>
              <div
                className="flex items-center justify-around mt-3 "
                onClick={() => {
                  setId(post?._id);
                  setShow(true);
                }}
              >
                <Image
                  src={image?.url}
                  className="bg-contain rounded-lg object-cover cursor-pointer bg-gray-200"
                  height={450}
                  width={670}
                  style={{
                    background: "#F0F0F0",
                    borderRadius: 8,
                  }}
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

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
      <UserLiked
        show={isShowUserLiked}
        setShow={setIsShowUserLiked}
        data={post?.liked_user}
      />
      <DetailPost show={show} setShow={setShow} id={id} />
      <UploadPost
        show={showEdit}
        setShow={setShowEdit}
        id={id}
        cbSuccess={cbSuccess}
      />
    </div>
  );
};

export default Post;
