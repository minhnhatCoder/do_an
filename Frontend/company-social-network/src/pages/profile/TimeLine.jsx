import React, { useEffect, useState } from "react";
import Post from "../../components/post";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { BsFillBriefcaseFill } from "react-icons/bs";
import { BiLink } from "react-icons/bi";
import { AiOutlineMail, AiFillPhone } from "react-icons/ai";
import { FaBirthdayCake, FaMapMarkerAlt } from "react-icons/fa";
import { InputPost } from "../home";
import { convertTimeStampToString } from "../../helper/timeHelper";
import { useRootState } from "../../store";
import PostServices from "../../services/postServices";
import { useNavigate } from "react-router-dom";

const TimeLine = ({ userInfo, setTabActive, images }) => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const currentUser = useRootState((state) => state.userInfo);
  const getPost = async () => {
    setLoading(true);
    const params = {
      "related_user[all]": [currentUser?._id, userInfo?._id],
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
  }, [userInfo?._id]);
  return (
    <div className="w-2/3 mx-auto mt-3">
      <div className="flex gap-3">
        <div className="w-1/3">
          <div className="w-full bg-white rounded-lg p-3">
            <p className="font-bold text-lg">Giới thiệu</p>
            <div className="mt-2 flex gap-3">
              <HiOutlineBuildingOffice2 className="w-6 h-6" color="#c3c7cc" />
              <p className="font-semibold">Getfly</p>
            </div>
            <div className="mt-2 flex gap-3">
              <BsFillBriefcaseFill className="w-6 h-6" color="#c3c7cc" />
              <div>
                <p className="font-semibold">{userInfo?.department?.name}</p>
                <p className="font-light text-neutral-400 text-sm">
                  {userInfo?.position?.name}
                </p>
              </div>
            </div>
            <div className="mt-2 flex gap-3">
              <AiOutlineMail className="w-6 h-6" color="#c3c7cc" />
              <p className="font-semibold">{userInfo?.email}</p>
            </div>
            <div className="mt-2 flex gap-3">
              <AiFillPhone className="w-6 h-6" color="#c3c7cc" />
              <p className="font-semibold">{userInfo?.phone}</p>
            </div>
            <div className="mt-2 flex gap-3">
              <FaBirthdayCake className="w-6 h-6" color="#c3c7cc" />
              <p className="font-semibold">
                {userInfo?.birth
                  ? convertTimeStampToString(userInfo?.birth)
                  : "(Chưa cập nhật)"}
              </p>
            </div>
            <div className="mt-2 flex gap-3">
              <BiLink className="w-6 h-6 min-w-6 min-h-6" color="#c3c7cc" />
              <a className="font-semibold truncate w-72 text-green-500 cursor-pointer">{`profile/${userInfo?.employee_id}`}</a>
            </div>
            <div className="mt-2 flex gap-3">
              <FaMapMarkerAlt className="w-6 h-6" color="#c3c7cc" />
              <p className="font-semibold">{userInfo?.address}</p>
            </div>
          </div>
          <div className="w-full bg-white rounded-lg p-3 mt-3 pb-8">
            <div className="flex justify-between">
              <p className="font-bold text-lg">Ảnh</p>
              <a className="text-blue-500 hover:text-orange-500 cursor-pointer">
                Xem tất cả
              </a>
            </div>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              {images
                ?.filter((_, idx) => idx < 4)
                ?.map((img) => (
                  <img
                    key={img?._id}
                    src={img?.url}
                    className="w-[110px] h-[110px] cursor-pointer object-cover"
                  />
                ))}
            </div>
          </div>
          <div className="w-full bg-white rounded-lg p-3 mt-3 pb-8">
            <div className="flex justify-between">
              <p className="font-bold text-lg">
                Bạn bè ({userInfo?.friends?.length})
              </p>
              <a
                className="text-blue-500 hover:text-orange-500 cursor-pointer"
                onClick={() => {
                  setTabActive(3);
                }}
              >
                Xem tất cả bạn bè
              </a>
            </div>

            <div className="flex gap-3 mt-3 flex-wrap min-h-[150px]">
              {userInfo?.friends
                ?.filter((f, i) => i < 5)
                ?.map((friend) => (
                  <div
                    className="w-[110px] h-[110px] cursor-pointer relative"
                    key={friend?._id}
                    onClick={() => {
                      navigate(`/profile/${friend?._id}`);
                    }}
                  >
                    <img
                      src={friend?.image}
                      className="w-[110px] h-[110px] cursor-pointer object-cover"
                    />
                    <div className="absolute bottom-0 bg-[#0000009c] left-0 right-0 text-center text-white">
                      {friend?.display_name}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="w-2/3">
          <InputPost
            getPost={getPost}
            upLoadToFriend={userInfo?._id != currentUser?._id}
          />
          <div className="mt-3 flex flex-col gap-3">
            {data?.map((item) => {
              return (
                <Post
                  key={item._id}
                  post={item}
                  setPost={setData}
                  posts={data}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeLine;
