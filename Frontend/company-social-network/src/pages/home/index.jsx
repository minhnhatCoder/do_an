import { Input, Avatar, Empty, FloatButton } from "antd";
import { BiGroup, BiNews } from "react-icons/bi";
import { FaMapMarkerAlt, FaPhotoVideo, FaTasks, FaUsers } from "react-icons/fa";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import React, { useEffect, useRef, useState } from "react";
import Post from "../../components/post";
import UploadPost from "../../components/uploadPost";
import PostServices from "../../services/postServices";
import { useRootState } from "../../store";
import UserServices from "../../services/user";
import { IoLogInOutline } from "react-icons/io5";
import {
  CiBookmark,
  CiBoxList,
  CiCalendar,
  CiCalendarDate,
  CiChat1,
  CiLocationOn,
  CiMemoPad,
  CiReceipt,
} from "react-icons/ci";
import { PiUsersThin, PiUsersThreeThin } from "react-icons/pi";
import useSocketStore from "../../store/socketStore";
import Toast from "../../components/noti";
import usePopupChatStore from "../../store/popupChatStore";
import ConversationsServices from "../../services/conversationServies";
import { getTimeByFormat } from "../../helper/timeHelper";
import dayjs from "dayjs";

const Home = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const userInfo = useRootState((state) => state.userInfo);
  const usersOnline = useRootState((state) => state.usersOnline);
  const resetUserInfo = useRootState((state) => state.resetUserInfo);
  const socket = useSocketStore((state) => state.socket);
  const [hasMore, setHasMore] = useState(false);
  const scrollRef = useRef(null);
  const addConversation = usePopupChatStore((state) => state?.addConversation);
  const [currentTime, setCurrentTime] = useState(
    `${getTimeByFormat("dddd")}, ${getTimeByFormat("DD/MM/YYYY HH:mm")}`
  );

  const onApproversRequest = async (_id, body) => {
    setLoading(true);
    try {
      const res = await UserServices.approveFriendRequest(_id, body);
      const status = body?.status == "approved" ? "chấp nhận" : "từ chối";

      socket?.emit("sendNotification", {
        userIds: [res?.data?.sender],
        data: {
          content: `${userInfo?.display_name} đã ${status} lời mời kết bạn`,
        },
      });
      resetUserInfo();
      Toast("success", res.message);
    } catch (error) {
      setLoading(false);
      Toast("error", error.message);
    }
  };
  const [quickAction, setQuickAction] = useState([
    { label: "Công việc", icon: <CiMemoPad className="w-7 h-7" />, link: "/" },
    { label: "Nghỉ phép", icon: <CiReceipt className="w-7 h-7" />, link: "/" },
    { label: "Nhóm", icon: <PiUsersThin className="w-7 h-7" />, link: "/" },
    { label: "Đã lưu", icon: <CiBookmark className="w-7 h-7" />, link: "/" },
    { label: "Tin nhắn", icon: <CiChat1 className="w-7 h-7" />, link: "/" },
    { label: "Sự kiện", icon: <CiCalendar className="w-7 h-7" />, link: "/" },
  ]);

  const getPost = async (_page) => {
    setLoading(true);
    const params = {
      "related_user[all]": userInfo?._id,
      limit: 5,
      page: _page ? _page : page,
      sort: "-created_at",
    };
    _page == 0 && setPage(1);
    setLoading(false);
    const res = await PostServices.getPosts(params);
    setHasMore(res?.data?.length < res?.count);
    _page == 1 ? setData(res?.data) : setData([...data, ...res.data]);
    setLoading(false);
  };
  useEffect(() => {
    getPost(1);
  }, []);

  useEffect(() => {
    page > 1 && getPost();
  }, [page]);

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = scrollRef.current;
    const isBottom = scrollTop + clientHeight === scrollHeight;
    if (isBottom && hasMore) {
      setPage(page + 1);
    }
  };

  const onMessage = async (params) => {
    try {
      const res = await ConversationsServices.getConversations(params);
      if (res?.data?.length > 0) {
        addConversation({ ...res?.data?.[0], isPopup: true });
      } else {
        const newConversation = await ConversationsServices.postConversation({
          participants: params["participants[all]"],
        });
        addConversation({ ...newConversation?.data, isPopup: true });
      }
    } catch (error) {
      console.log(error?.message);
    }
  };

  useEffect(() => {
    const itv = setInterval(() => {
      setCurrentTime(
        `${getTimeByFormat("dddd")}, ${getTimeByFormat("DD/MM/YYYY HH:mm")}`
      );
    });
    return () => clearInterval(itv);
  }, []);

  return (
    <div className="p-2 bg-white">
      <div className="  flex items-start justify-between gap-10 !px-14 !pb-0 relative">
        <div className="w-1/5">
          <div className="rounded-lg px-4 py-3 bg-white border min-h-[215px] mb-3 flex flex-col items-center">
            <Avatar className="border" size={120} src={userInfo?.image || ""} />
            <p className="text-center capitalize mt-2 text-sm">{currentTime}</p>
            <p className="text-center font-bold text-sm">
              Chào {dayjs().hour() < 12 ? "buổi sáng" : "buổi chiều"},{" "}
              {userInfo?.display_name}
            </p>
            <div className="flex justify-center items-center gap-2 border-green-500 p-2 mt-2 rounded-lg border-2 h-10 hover:border-green-400 cursor-pointer">
              <IoLogInOutline size={30} className="text-green-500" />
              <p className="text-green-500">Chấm công</p>
            </div>
          </div>
          <div className="rounded-lg p-3 bg-white min-h-[calc(100vh-332px)] border">
            {quickAction?.map((i, id) => (
              <div
                className="flex items-center gap-2 cursor-pointer py-3"
                key={id}
              >
                {i?.icon}
                <p className="font-semibold text-base">{i?.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div
          className="w-3/5 flex flex-col gap-4 h-[calc(100vh-80px)] overflow-scroll hide-scroll"
          ref={scrollRef}
          onScroll={handleScroll}
        >
          <InputPost getPost={getPost} />
          {/* post */}
          {data?.map((item) => {
            return (
              <Post key={item._id} post={item} setPost={setData} posts={data} />
            );
          })}
        </div>
        <div className="w-1/4">
          <div className="rounded-lg p-3 bg-white mb-3 border min-h-[215px]">
            <p className="font-semibold text-base mb-7">
              Lời mời kết bạn (
              {
                userInfo?.friend_requests?.filter(
                  (f) => f?.sender?._id != userInfo?._id
                )?.length
              }
              )
            </p>

            {userInfo?.friend_requests?.filter(
              (f) => f?.sender?._id != userInfo?._id
            )?.length > 0 ? (
              userInfo?.friend_requests
                ?.filter((f) => f?.sender?._id != userInfo?._id)
                ?.map((friendRequest, index) => {
                  if (index < 2)
                    return (
                      <div
                        className="flex justify-between items-center mb-2"
                        key={index}
                      >
                        <div className="flex items-center justify-center gap-2 cursor-pointer">
                          <Avatar
                            className="border "
                            size={50}
                            src={friendRequest?.sender?.image || ""}
                          />
                          <p className="font-semibold text-base">
                            {friendRequest?.sender?.display_name}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className="inline-block rounded-full bg-neutral-800 px-3 pb-2 pt-2.5 text-xs font-medium  text-neutral-50 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] "
                            onClick={() => {
                              onApproversRequest(friendRequest?._id, {
                                status: "approved",
                              });
                            }}
                          >
                            Chấp nhận
                          </button>
                          <button
                            className="inline-block rounded-full bg-neutral-50 px-3 pb-2 pt-2.5 text-xs font-medium text-neutral-800 shadow-[0_4px_9px_-4px_#cbcbcb] "
                            onClick={() => {
                              onApproversRequest(friendRequest?._id, {
                                status: "rejected",
                              });
                            }}
                          >
                            Từ chối
                          </button>
                        </div>
                      </div>
                    );
                })
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Empty />
              </div>
            )}
          </div>
          <div className="rounded-lg p-3 bg-white border h-[calc(100vh-330px)]">
            <p className="font-semibold text-base mb-7">
              Bạn bè ({userInfo?.friends?.length})
            </p>
            {userInfo?.friends
              ?.map((f) => {
                if (usersOnline?.find((u) => u?._id == f?._id)) {
                  return { ...f, online: true };
                } else return { ...f, online: false };
              })
              .sort((a, b) => Number(b.online) - Number(a.online))
              .map((i) => (
                <div
                  className="flex items-center gap-2 cursor-pointer relative hover:bg-neutral-100 p-3 rounded-lg"
                  key={i?._id}
                  onClick={() => {
                    onMessage({
                      "participants[all]": [userInfo?._id, i?._id],
                      "type:eq": "personal",
                    });
                  }}
                >
                  <Avatar className="border " size={50} src={i?.image || ""} />
                  <p className="font-semibold text-base">{i?.display_name}</p>
                  {i?.online ? (
                    <span className="bottom-2 left-11 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white  rounded-full"></span>
                  ) : null}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
export const InputPost = ({ getPost, upLoadToFriend }) => {
  const [isShowCreatePost, setIsShowCreatePost] = useState(false);
  const userInfo = useRootState((state) => state.userInfo);

  return (
    <div className="py-3 px-5 rounded-lg bg-white border">
      <div className="flex items-center justify-center gap-3 pb-3 border-b-2 border-gray-200">
        <Avatar
          className="border border-black"
          size={40}
          src={userInfo?.image}
        />
        <Input
          placeholder={`${userInfo?.display_name} ơi, bạn đang nghĩ gì?`}
          className="flex-1 rounded-full bg-gray-50"
          onClick={() => {
            setIsShowCreatePost(true);
          }}
        />
        <BiNews className="w-8 h-8" color="#1b74e4" />
      </div>
      <div className="flex items-center justify-around mt-3">
        <div className="flex items-center justify-center gap-2 cursor-pointer">
          <FaPhotoVideo className="w-8 h-8" color="#45bd62" />
          <p className="font-semibold">Ảnh</p>
        </div>
        <div className="flex items-center justify-center gap-2 cursor-pointer">
          <MdOutlineEmojiEmotions className="w-8 h-8" color="#f7b928" />
          <p className="font-semibold">Cảm xúc</p>
        </div>
      </div>
      <UploadPost
        upLoadToFriend={upLoadToFriend}
        show={isShowCreatePost}
        setShow={setIsShowCreatePost}
        cbSuccess={() => {
          getPost();
        }}
      />
    </div>
  );
};
