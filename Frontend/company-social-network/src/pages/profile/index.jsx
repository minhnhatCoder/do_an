import { Tabs } from "antd";
import React, { useState } from "react";
import Info from "./Info";
import TimeLine from "./TimeLine";
import Friend from "./Friend";
import Image from "./Image";

const Profile = () => {
  const [tabActive, setTabActive] = useState(1);
  const items = [
    {
      key: 1,
      label: <p className="font-bold text-lg">Dòng thời gian</p>,
    },
    {
      key: 2,
      label: <p className="font-bold text-lg">Giới thiệu</p>,
    },
    {
      key: 3,
      label: <p className="font-bold text-lg">Bạn bè</p>,
    },
    {
      key: 4,
      label: <p className="font-bold text-lg">Ảnh</p>,
    },
  ];
  const onChangeTab = (key) => {
    setTabActive(key);
  };
  return (
    <div className="main-content !pt-0">
      <div className="w-2/3 mx-auto bg-white rounded-b-lg h-max">
        <div className="w-full h-[350px] relative ">
          <img
            src="https://kynguyenlamdep.com/wp-content/uploads/2022/06/anh-gai-xinh-cuc-dep.jpg"
            className="w-full h-[350px] object-cover"
          />
          <div className="w-56 h-56 rounded-full  absolute -bottom-7 left-1/2 -translate-x-1/2 ">
            <img
              src="https://kynguyenlamdep.com/wp-content/uploads/2022/06/anh-gai-xinh-cuc-dep.jpg"
              className="w-56 h-56 rounded-full border-4 border-white"
            />
          </div>
        </div>
        <p className="mt-10 font-bold text-center text-3xl">Lê Văn Bình</p>
        <p className="mt-3 text-center font-semibold">Đại ca giang hồ</p>
        <div className="mt-4 pl-3">
          <Tabs defaultActiveKey={1} items={items} onChange={onChangeTab} />
        </div>
      </div>
      {tabActive == 1 && <TimeLine />}
      {tabActive == 2 && <Info />}
      {tabActive == 3 && <Friend />}
      {tabActive == 4 && <Image />}
    </div>
  );
};

export default Profile;
