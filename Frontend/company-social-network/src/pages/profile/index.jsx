import { Button, Dropdown, Modal, Spin, Tabs, Upload } from "antd";
import React, { useEffect, useState } from "react";
import Info from "./Info";
import TimeLine from "./TimeLine";
import Friend from "./Friend";
import Image from "./Image";
import UserServices from "../../services/user";
import UploadServices from "../../services/upload";
import { useParams } from "react-router-dom";
import { useRootState } from "../../store";
import { BsFillPostcardHeartFill } from "react-icons/bs";
import { AiFillCamera, AiOutlineUpload } from "react-icons/ai";
import Toast from "../../components/noti";
import { Text, TextArea } from "../../components/input";

const Profile = () => {
  const [tabActive, setTabActive] = useState(1);
  const { id } = useParams();
  const userInfo = useRootState((state) => state.userInfo);
  const setUserInfo = useRootState((state) => state.setUserInfo);
  const [loading, setLoading] = useState(false);
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
  const [isOpenUploadAvatar, setIsOpenUploadAvatar] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [user, setUser] = useState({});
  const getUserInfo = async () => {
    const data = await UserServices.getUser(id);
    setUser(data.data);
  };

  const handleChange = async (info) => {
    setLoading(true);
    try {
      // Get this url from response in real world.
      const formData = new FormData();
      formData.append("files", info.file.originFileObj);
      formData.get("files");
      const res = await UploadServices.uploadImage(formData);
      setLoading(false);
      setImageUrl(res?.files?.[0].url);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleUpdateAvatar = async () => {
    setLoading(true);
    try {
      const res = await UserServices.updateUser(id, { image: imageUrl });
      setUserInfo(res.data);
      setImageUrl(null);
      setLoading(false);
      setIsOpenUploadAvatar(false);
      Toast("success", res?.message);
    } catch (error) {
      setLoading(false);
      Toast("success", error?.response?.data?.message);
    }
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      Toast("warning", "Bạn chỉ có thể tải JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      Toast("danger", "Kích thước ảnh phải nhỏ hơn 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  // const itemsUser = [
  //   {
  //     key: "1",
  //     label: <p className="font-semibold">Xem trang cá nhân</p>,
  //     icon: (
  //       <AiFillCamera
  //         className="border border-black"
  //         size={32}
  //         src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1"
  //       />
  //     ),
  //   },
  //   {
  //     key: "2",
  //     label: <a className="font-semibold">Xem bài viết</a>,
  //     icon: <BsFillPostcardHeartFill className="w-5 h-5" />,
  //   },
  // ];

  const onChangeTab = (key) => {
    setTabActive(key);
  };

  useEffect(() => {
    getUserInfo();
  }, [id]);

  return (
    <div className="main-content !pt-0">
      <div className="w-2/3 mx-auto bg-white rounded-b-lg h-max">
        <div className="w-full h-[350px] relative ">
          <img
            src="https://kynguyenlamdep.com/wp-content/uploads/2022/06/anh-gai-xinh-cuc-dep.jpg"
            className="w-full h-[350px] object-cover"
          />
          <div className="w-56 h-56 rounded-full  absolute -bottom-7 left-1/2 -translate-x-1/2 ">
            <div className="relative">
              <img
                src={user?.image}
                className="w-56 h-56 rounded-full border-4 border-white cursor-pointer object-cover"
              />
              {userInfo?._id == id || userInfo?.employee_id == id ? (
                <div
                  className="absolute bottom-5 right-5 p-2 rounded-full bg-gray-200 cursor-pointer"
                  onClick={() => {
                    setIsOpenUploadAvatar(true);
                  }}
                >
                  <AiFillCamera className="w-6 h-6" />
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <p className="mt-10 font-bold text-center text-3xl">{user?.display_name}</p>
        <p className="mt-3 text-center font-semibold">Đại ca giang hồ</p>
        <div className="mt-4 pl-3">
          <Tabs defaultActiveKey={1} items={items} onChange={onChangeTab} />
        </div>
      </div>
      {tabActive == 1 && <TimeLine userInfo={user} setTabActive={setTabActive} />}
      {tabActive == 2 && <Info userInfo={user} />}
      {tabActive == 3 && <Friend />}
      {tabActive == 4 && <Image />}

      <Modal
        title={
          <div className="flex items-center justify-center gap-2 border-b pb-2 border-gray-300">
            <p className="font-bold text-lg text-center">Cập nhật ảnh đại diện</p>
          </div>
        }
        open={isOpenUploadAvatar}
        onOk={() => {
          setIsOpenUploadAvatar(false);
        }}
        footer={[
          <button
            key="back"
            className="btn-gray mr-2 rounded-lg"
            onClick={() => {
              setIsOpenUploadAvatar(false);
              setImageUrl(null);
            }}
          >
            Hủy bỏ
          </button>,
          <button
            key="1"
            className="btn-blue"
            onClick={() => {
              handleUpdateAvatar();
            }}
          >
            Lưu
          </button>,
        ]}
        centered
        width={500}
      >
        <Spin tip="Loading..." spinning={loading}>
          <div className="flex items-center justify-center w-full h-96 flex-col">
            {imageUrl && <TextArea title={"Mô tả"} classname="mb-4 w-96" />}
            <Upload
              name="avatar"
              // listType="picture-circle"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleChange}
              maxCount={1}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" className="w-56 h-56 rounded-full object-cover" />
              ) : (
                <button className="btn-blue flex items-center justify-center gap-2">
                  <AiOutlineUpload className="w-5 h-5" /> Chọn ảnh
                </button>
              )}
            </Upload>
          </div>
        </Spin>
      </Modal>
    </div>
  );
};

export default Profile;
