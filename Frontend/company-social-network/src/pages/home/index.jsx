import { Input, Avatar } from "antd";
import { BiGroup, BiNews } from "react-icons/bi";
import { FaMapMarkerAlt, FaPhotoVideo, FaTasks, FaUsers } from "react-icons/fa";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import React, { useEffect, useState } from "react";
import Post from "../../components/post";
import UploadPost from "../../components/uploadPost";
import PostServices from "../../services/postServices";
import { useRootState } from "../../store";
import { HiOutlineClipboardList } from "react-icons/hi";
import { BsCalendarDate, BsMessenger, BsSave2 } from "react-icons/bs";
import { RiCalendarEventFill } from "react-icons/ri";

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const userInfo = useRootState((state) => state.userInfo);
  const usersOnline = useRootState((state) => state.usersOnline);
  const [quickAction, setQuickAction] = useState([
    {
      label: userInfo?.display_name,
      icon: <Avatar className="border " size={50} src={userInfo?.image || ""} />,
      link: "/",
    },
    { label: "Thành viên trong tổ chức", icon: <FaUsers className="w-10 h-10" />, link: "/" },
    { label: "Công việc", icon: <FaTasks className="w-10 h-10" />, link: "/" },
    { label: "Chấm công", icon: <FaMapMarkerAlt className="w-10 h-10" />, link: "/" },
    { label: "Nghỉ phép", icon: <HiOutlineClipboardList className="w-10 h-10" />, link: "/" },
    { label: "Nhóm", icon: <BiGroup className="w-10 h-10" />, link: "/" },
    { label: "Đã lưu", icon: <BsSave2 className="w-10 h-10" />, link: "/" },
    { label: "Tin nhắn", icon: <BsMessenger className="w-10 h-10" />, link: "/" },
    { label: "Sự kiện", icon: <RiCalendarEventFill className="w-10 h-10" />, link: "/" },
    { label: "Lịch", icon: <BsCalendarDate className="w-10 h-10" />, link: "/" },
  ]);

  const getPost = async () => {
    setLoading(true);
    const params = {
      "related_user[all]": userInfo?._id,
      limit: 5,
      page: 1,
      sort: "-created_at",
    };
    setLoading(false);
    const res = await PostServices.getPosts(params);
    setData(res?.data);
    setLoading(false);
  };
  useEffect(() => {
    getPost();
  }, []);

  return (
    <div className="main-content flex items-start justify-between gap-3">
      <div className="w-1/4">
        <div className="rounded-lg p-3 bg-white">
          <p className="font-bold text-2xl mb-7">Thao tác nhanh</p>

          {quickAction?.map((i, id) => (
            <div className="flex items-center gap-2 cursor-pointer mb-5" key={id}>
              {i?.icon}
              <p className="font-bold text-sm">{i?.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-1/2 flex flex-col gap-4">
        <InputPost getPost={getPost} />
        {/* post */}
        {data?.map((item) => {
          return <Post key={item._id} post={item} setPost={setData} posts={data} />;
        })}
      </div>
      <div className="w-1/4">
        <div className="rounded-lg p-3 bg-white mb-3">
          <p className="font-bold text-2xl mb-7">Lời mời kết bạn</p>
          <div className="flex items-center gap-2 cursor-pointer mb-5">
            <Avatar className="border " size={50} src={userInfo?.image || ""} />
            <p className="font-bold text-sm">{userInfo?.display_name}</p>
          </div>
        </div>
        <div className="rounded-lg p-3 bg-white">
          <p className="font-bold text-2xl mb-7">Bạn bè</p>
          {userInfo?.friends
            ?.map((f) => {
              if (usersOnline?.find((u) => u?._id == f?._id)) {
                return { ...f, online: true };
              } else return { ...f, online: false };
            })
            .sort((a, b) => Number(b.online) - Number(a.online))
            .map((i) => (
              <div className="flex items-center gap-2 cursor-pointer mb-5 relative" key={i?._id}>
                <Avatar className="border " size={50} src={i?.image || ""} />
                <p className="font-bold text-sm">{i?.display_name}</p>
                {i?.online ? (
                  <span className="bottom-0 left-9 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white  rounded-full"></span>
                ) : null}
              </div>
            ))}
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
    <div className="py-3 px-5 rounded-lg bg-white box_shadow-light">
      <div className="flex items-center justify-center gap-3 pb-3 border-b-2 border-gray-200">
        <Avatar className="border border-black" size={40} src={userInfo?.image} />
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
