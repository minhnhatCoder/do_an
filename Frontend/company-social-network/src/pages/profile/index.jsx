import { Button, Dropdown, Modal, Popconfirm, Spin, Tabs, Upload } from "antd";
import React, { useEffect, useState } from "react";
import Info from "./Info";
import TimeLine from "./TimeLine";
import Friend from "./Friend";
import Image from "./Image";
import UserServices from "../../services/user";
import UploadServices from "../../services/upload";
import { useNavigate, useParams } from "react-router-dom";
import { useRootState } from "../../store";
import { BsFillPostcardHeartFill, BsMessenger, BsPersonPlusFill } from "react-icons/bs";
import { AiFillCamera, AiOutlineUpload } from "react-icons/ai";
import Toast from "../../components/noti";
import { Text, TextArea } from "../../components/input";
import PostServices from "../../services/postServices";
import _ from "lodash";
import ConversationsServices from "../../services/conversationServies";
import { BiSolidUserX, BiUserCheck, BiUserX } from "react-icons/bi";
import useSocketStore from "../../store/socketStore";

const Profile = () => {
  const [tabActive, setTabActive] = useState(1);
  const { id } = useParams();
  const userInfo = useRootState((state) => state.userInfo);
  const userList = useRootState((state) => state.users);
  const setUserInfo = useRootState((state) => state.setUserInfo);
  const resetUserInfo = useRootState((state) => state.resetUserInfo);
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
  const [image, setImage] = useState({});
  const [user, setUser] = useState({});
  const [images, setImages] = useState([]);
  const [content, setContent] = useState("");
  const [imageType, setImageType] = useState(1);
  const navigate = useNavigate();
  const socket = useSocketStore((state) => state.socket);

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
      setImage(res?.files?.[0]);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleUpdateAvatar = async () => {
    if (_.isEmpty(image)) {
      return Toast("error", "Vui lòng chọn ảnh");
    }
    setLoading(true);
    let res;
    try {
      if (imageType == 1) {
        res = await UserServices.updateUser(user?._id, { image: image?.url });
      } else {
        res = await UserServices.updateUser(user?._id, { cover_image: image?.url });
      }
      await PostServices.uploadPost({
        title: `vừa cập nhật ảnh ${imageType == 1 ? "đại diện" : "bìa"} của ${
          user?.gender == "Nam" ? "anh ấy" : "cô ấy"
        }`,
        content,
        created_user: userInfo?._id,
        attachments: image,
        show_type: 0,
        related_user: userList?.map((u) => u?._id),
      });
      setUserInfo(res.data);
      getUserInfo();
      setImage({});
      getPost();
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

  const sendRequestFriend = async (id) => {
    try {
      const res = await UserServices.sendFriendRequest({
        receiver: id,
      });
      socket?.emit("sendNotification", {
        userIds: [id],
        data: {
          content: `${userInfo?.display_name} đã gửi cho bạn lời mời kết bạn`,
        },
      });
      await resetUserInfo();
      getUserInfo();
      Toast("success", res?.message);
    } catch (error) {
      Toast("error", error?.message);
    }
  };
  const unSendRequestFriend = async (id) => {
    try {
      const res = await UserServices.deleteFriendRequest(id);
      await resetUserInfo();
      getUserInfo();
      Toast("success", res?.message);
    } catch (error) {
      Toast("error", error?.message);
    }
  };
  const removeFriend = async () => {
    try {
      const res = await UserServices.removeFriend(user?._id);
      await resetUserInfo();
      getUserInfo();
      Toast("success", res?.message);
    } catch (error) {
      Toast("error", error?.message);
    }
  };

  const onMessage = async (params) => {
    try {
      const res = await ConversationsServices.getConversations(params);
      if (res?.data?.length > 0) {
        navigate("/chat/" + res?.data?.[0]?._id);
      } else {
        const newConversation = await ConversationsServices.postConversation({
          participants: params["participants[all]"],
        });
        navigate("/chat/" + newConversation?.data?._id);
      }
    } catch (error) {
      console.log(error?.message);
    }
  };

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
      await resetUserInfo();
      setLoading(false);
      Toast("success", res.message);
    } catch (error) {
      setLoading(false);
      Toast("error", error.message);
    }
  };

  const onChangeTab = (key) => {
    setTabActive(key);
  };

  const getPost = async () => {
    setLoading(true);
    const params = {
      "related_user[in]": [user?._id],
      limit: 9999,
      page: 1,
      sort: "-created_at",
    };
    setLoading(false);
    const res = await PostServices.getPosts(params);
    const imgList = res?.data?.map((p) => p?.attachments.map((a) => ({ ...a, post_id: p?._id }))).flat(Infinity);
    setImages(imgList);
    setLoading(false);
  };

  useEffect(() => {
    getUserInfo();
  }, [id]);
  useEffect(() => {
    getPost();
  }, [user?._id]);

  return (
    <div className="main-content !pt-0">
      <div className="w-2/3 mx-auto bg-white rounded-b-lg h-max">
        <div className="w-full h-[350px] relative ">
          <img src={user?.cover_image} className="w-full h-[350px] object-cover" />
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
                    setImageType(1);
                  }}
                >
                  <AiFillCamera className="w-6 h-6" />
                </div>
              ) : null}
            </div>
          </div>
          {userInfo?._id == id || userInfo?.employee_id == id ? (
            <div
              className="absolute bottom-3 right-2 bg-[#0000006e] hover:bg-[#000000a4] rounded-md flex items-center justify-center gap-2 w-max p-2 cursor-pointer"
              onClick={() => {
                setIsOpenUploadAvatar(true);
                setImageType(2);
              }}
            >
              <AiFillCamera className="w-6 h-6 text-white" />
              <p className="text-white font-bold">Cập nhật ảnh bìa</p>
            </div>
          ) : null}
        </div>
        <p className="mt-10 font-bold text-center text-3xl">{user?.display_name}</p>
        <p className="mt-3 text-center font-semibold">Đại ca giang hồ</p>
        <div className="flex items-center justify-center gap-3 mt-2">
          {userInfo?._id == user?._id ? null : userInfo?.friends?.find((f) => user?._id == f?._id) ? (
            <div className="flex items-center justify-center gap-3">
              <Popconfirm
                title="Hủy kết bạn"
                description="Bạn có chắc chắn muốn hủy kết bạn?"
                onConfirm={removeFriend}
                okText="Đồng ý"
                cancelText="Hủy"
              >
                <Button icon={<BiUserCheck />} size="large" className="flex items-center justify-center">
                  Bạn bè
                </Button>
              </Popconfirm>
            </div>
          ) : userInfo?.friend_requests?.find((r) => r?.sender?._id == user?._id || r?.receiver == user?._id) ? (
            <div>
              {userInfo?.friend_requests?.find((r) => r?.sender?._id == user?._id || r?.receiver == user?._id)
                ?.receiver == userInfo?._id ? (
                <div className="flex items-center justify-center gap-3">
                  <Button
                    type="primary"
                    icon={<BsPersonPlusFill />}
                    size="large"
                    className="flex items-center justify-center"
                    onClick={() => {
                      onApproversRequest(
                        userInfo?.friend_requests?.find(
                          (r) => r?.sender?._id == user?._id && r?.receiver == userInfo?._id
                        )?._id,
                        { status: "approved" }
                      );
                    }}
                  >
                    Chấp nhận
                  </Button>
                  <Button
                    danger
                    icon={<BiUserX />}
                    size="large"
                    className="flex items-center justify-center !bg-red-500"
                    onClick={() => {
                      onApproversRequest(
                        userInfo?.friend_requests?.find(
                          (r) => r?.sender?._id == user?._id && r?.receiver == userInfo?._id
                        )?._id,
                        { status: "rejected" }
                      );
                    }}
                  >
                    Từ chối
                  </Button>
                </div>
              ) : (
                <Button
                  danger
                  icon={<BiSolidUserX className="w-6 h-6" />}
                  size="large"
                  className="flex items-center justify-center"
                  onClick={() => {
                    unSendRequestFriend(
                      userInfo?.friend_requests?.find((r) => r?.sender?._id == user?._id || r?.receiver == user?._id)
                        ?._id
                    );
                  }}
                >
                  Xóa lời mời
                </Button>
              )}
            </div>
          ) : (
            <Button
              type="primary"
              icon={<BsPersonPlusFill />}
              size="large"
              className="flex items-center justify-center"
              onClick={() => {
                sendRequestFriend(user?._id);
              }}
            >
              Thêm bạn bè
            </Button>
          )}
          {userInfo?._id != user?._id && (
            <Button
              icon={<BsMessenger />}
              size="large"
              className="flex items-center justify-center"
              onClick={() => onMessage({ "participants[all]": [userInfo?._id, user?._id], "type:eq": "personal" })}
            >
              Nhắn tin
            </Button>
          )}
        </div>

        <div className="mt-4 pl-3">
          <Tabs defaultActiveKey={1} items={items} onChange={onChangeTab} />
        </div>
      </div>
      {tabActive == 1 && <TimeLine userInfo={user} setTabActive={setTabActive} images={images} />}
      {tabActive == 2 && <Info userInfo={user} />}
      {tabActive == 3 && <Friend />}
      {tabActive == 4 && <Image images={images} />}

      <Modal
        title={
          <div className="flex items-center justify-center gap-2 border-b pb-2 border-gray-300">
            <p className="font-bold text-lg text-center">
              {imageType == 1 ? "Cập nhật ảnh đại diện" : "Cập nhật ảnh bìa"}
            </p>
          </div>
        }
        open={isOpenUploadAvatar}
        onOk={() => {
          setIsOpenUploadAvatar(false);
        }}
        onCancel={() => {
          setIsOpenUploadAvatar(false);
        }}
        footer={[
          <button
            key="back"
            className="btn-gray mr-2 rounded-lg"
            onClick={() => {
              setIsOpenUploadAvatar(false);
              setImage({});
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
            {image?.url && (
              <TextArea
                title={"Mô tả"}
                className="mb-4 w-96"
                value={content}
                onChange={(e) => setContent(e?.target?.value)}
              />
            )}
            <Upload
              name="avatar"
              // listType="picture-circle"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleChange}
              maxCount={1}
            >
              {image?.url ? (
                <img src={image?.url} alt="avatar" className="w-56 h-56 rounded-full object-cover" />
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
