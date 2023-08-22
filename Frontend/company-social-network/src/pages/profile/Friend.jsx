import React, { useEffect, useState } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { GrFormClose } from "react-icons/gr";
import { BiCheckDouble, BiSolidBriefcase } from "react-icons/bi";
import { FaSitemap } from "react-icons/fa";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { useParams } from "react-router-dom";
import UserServices from "../../services/user";
import Toast from "../../components/noti";
import { Empty, Spin } from "antd";

const Friend = () => {
  const { id } = useParams();
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFriendTab, setIsFriendTab] = useState(true);
  const getUserFriends = async () => {
    setLoading(true);
    try {
      const res = await UserServices.getUser(id);
      setFriends(res.data.friends);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Toast("error", error.message);
    }
  };
  const getUserFriendRequests = async () => {
    setLoading(true);
    try {
      const res = await UserServices.getUser(id);
      setFriendRequests(res.data.friend_requests);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Toast("error", error.message);
    }
  };

  const onApproversRequest = async (_id, body) => {
    setLoading(true);
    try {
      const res = await UserServices.approveFriendRequest(_id, body);
      getUserFriends();
      getUserFriendRequests();
      setLoading(false);
      Toast("success", res.message);
    } catch (error) {
      setLoading(false);
      Toast("error", error.message);
    }
  };
  useEffect(() => {
    getUserFriends();
    getUserFriendRequests();
  }, []);
  return (
    <Spin spinning={loading} size="large">
      <div className="w-2/3 rounded-lg bg-white mx-auto mt-3 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="font-bold text-2xl">Bạn bè</p>
            <span className="text-sm text-neutral-500 mt-2">{friends?.length ?? 0} bạn bè</span>
          </div>
          <p
            className="font-semibold text-blue-500 hover:text-orange-500 cursor-pointer"
            onClick={() => {
              setIsFriendTab(!isFriendTab);
            }}
          >
            {isFriendTab ? "Lời mời kết bạn" : "Danh sách bạn bè"}
          </p>
        </div>
        {isFriendTab ? (
          <div className="flex items-start justify-start gap-3 flex-wrap mt-7">
            {friends?.length > 0 ? (
              friends?.map((friend, index) => {
                return (
                  <div className="w-[287px] mt-3 rounded-lg" key={index}>
                    <img src={friend?.image} className="w-full h-[300px] rounded-lg" />
                    <p className="font-bold mt-3 pl-3">{friend?.display_name}</p>
                    <div className="flex items-center pl-3 gap-2">
                      <HiOutlineBuildingOffice className="w-4 h-4 text-neutral-500" />
                      <p className="text-sm text-neutral-500">Getfly</p>
                    </div>
                    <div className="flex items-center pl-3 gap-2">
                      <BiSolidBriefcase className="w-4 h-4 text-neutral-500" />
                      <p className="text-sm text-neutral-500">
                        {friend?.position?.name} {friend?.department?.name}
                      </p>
                    </div>
                    <div className="flex items-center pl-3 gap-2">
                      <FaSitemap className="w-4 h-4 text-neutral-500" />
                      <p className="text-sm text-neutral-500">{friend?.department?.name}</p>
                    </div>
                    <div className="px-3">
                      <button className="btn-gray w-full mt-3 !py-2 flex items-center justify-center gap-3">
                        <AiOutlineCheck className="text-green-600 w-6 h-6" />
                        Bạn bè
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <Empty />
            )}
          </div>
        ) : (
          <div className="flex items-start justify-start gap-3 flex-wrap mt-7">
            {friendRequests?.length > 0 ? (
              friendRequests?.map((friendRequest, index) => {
                return (
                  <div className="w-[287px] mt-3 rounded-lg" key={index}>
                    <img src={friendRequest?.sender?.image} className="w-full h-[300px] rounded-lg" />
                    <p className="font-bold mt-3 pl-3">{friendRequest?.sender?.display_name}</p>
                    <div className="flex items-center pl-3 gap-2">
                      <HiOutlineBuildingOffice className="w-4 h-4 text-neutral-500" />
                      <p className="text-sm text-neutral-500">Getfly</p>
                    </div>
                    <div className="flex items-center pl-3 gap-2">
                      <BiSolidBriefcase className="w-4 h-4 text-neutral-500" />
                      <p className="text-sm text-neutral-500">
                        {friendRequest?.sender?.position?.name} {friendRequest?.sender?.department?.name}
                      </p>
                    </div>
                    <div className="flex items-center pl-3 gap-2">
                      <FaSitemap className="w-4 h-4 text-neutral-500" />
                      <p className="text-sm text-neutral-500">{friendRequest?.sender?.department?.name}</p>
                    </div>
                    <div className="px-3 flex items-center flex-col">
                      <button
                        className="btn-green w-full mt-3 !py-2 flex items-center justify-center gap-3"
                        onClick={() => {
                          onApproversRequest(friendRequest?._id, { status: "approved" });
                        }}
                      >
                        <BiCheckDouble className="text-white w-6 h-6" />
                        Chấp nhận
                      </button>
                      <button
                        className="btn-red w-full mt-3 !py-2 flex items-center justify-center gap-3"
                        onClick={() => {
                          onApproversRequest(friendRequest?._id, { status: "rejected" });
                        }}
                      >
                        <AiOutlineClose className="!text-white w-6 h-6" />
                        Từ chối
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <Empty />
            )}
          </div>
        )}
      </div>
    </Spin>
  );
};

export default Friend;
