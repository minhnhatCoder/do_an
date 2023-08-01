import React from "react";
import Post from "../../components/post";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { BsFillBriefcaseFill } from "react-icons/bs";
import { BiLink } from "react-icons/bi";
import { AiOutlineMail, AiFillPhone } from "react-icons/ai";
import { FaBirthdayCake, FaMapMarkerAlt } from "react-icons/fa";
import { InputPost } from "../home";
import { convertTimeStampToString } from "../../helper/timeHelper";

const TimeLine = ({ userInfo }) => {
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
                <p className="font-light text-neutral-400 text-sm">{userInfo?.position?.name}</p>
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
                {userInfo?.birth ? convertTimeStampToString(userInfo?.birth) : "(Chưa cập nhật)"}
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
              <a className="text-blue-500 hover:text-orange-500 cursor-pointer">Xem tất cả</a>
            </div>
            <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
              <img
                src="https://hinhnen4k.com/wp-content/uploads/2023/02/anh-gai-xinh-vn-2.jpg"
                className="w-[110px] h-[110px] cursor-pointer"
              />
              <img
                src="https://hinhnen4k.com/wp-content/uploads/2023/02/anh-gai-xinh-vn-2.jpg"
                className="w-[110px] h-[110px] cursor-pointer"
              />
              <img
                src="https://hinhnen4k.com/wp-content/uploads/2023/02/anh-gai-xinh-vn-2.jpg"
                className="w-[110px] h-[110px] cursor-pointer"
              />
              <img
                src="https://hinhnen4k.com/wp-content/uploads/2023/02/anh-gai-xinh-vn-2.jpg"
                className="w-[110px] h-[110px] cursor-pointer"
              />
              <img
                src="https://hinhnen4k.com/wp-content/uploads/2023/02/anh-gai-xinh-vn-2.jpg"
                className="w-[110px] h-[110px] cursor-pointer"
              />
              <img
                src="https://hinhnen4k.com/wp-content/uploads/2023/02/anh-gai-xinh-vn-2.jpg"
                className="w-[110px] h-[110px] cursor-pointer"
              />
            </div>
          </div>
          <div className="w-full bg-white rounded-lg p-3 mt-3 pb-8">
            <div className="flex justify-between">
              <p className="font-bold text-lg">Bạn bè (12)</p>
              <a className="text-blue-500 hover:text-orange-500 cursor-pointer">Xem tất cả bạn bè</a>
            </div>
            <div className="flex gap-3 mt-3 flex-wrap">
              <div className="w-[110px] h-[110px] cursor-pointer relative">
                <img
                  src="https://hinhnen4k.com/wp-content/uploads/2023/02/anh-gai-xinh-vn-2.jpg"
                  className="w-[110px] h-[110px] cursor-pointer"
                />
                <div className="absolute bottom-0 bg-[#0000009c] left-0 right-0 text-center text-white">
                  Lê Văn Bình
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-2/3">
          <InputPost />
          <div className="mt-3">
            <Post />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeLine;
