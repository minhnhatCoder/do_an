import { Avatar, Modal, Radio, Spin, Upload } from "antd";
import React, { useState } from "react";
import { useRootState } from "../../store";
import Button from "../button";
import { BiSolidLock } from "react-icons/bi";
import TextArea from "antd/es/input/TextArea";
import { FaPhotoVideo, FaUsers } from "react-icons/fa";
import { ImEarth } from "react-icons/im";
import { HiLocationMarker, HiUsers } from "react-icons/hi";
import { RiLiveLine } from "react-icons/ri";
import { AiFillSetting, AiOutlineFileGif, AiOutlineSmile, AiOutlineUpload } from "react-icons/ai";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import UploadImage from "../uploadImage";
import PostServices from "../../services/postServices";
import Toast from "../noti";
import SelectDepartment from "../Select/department";
import SelectUsers from "../Select/Users";

const UploadPost = ({ show, setShow, cbSuccess }) => {
  const userInfo = useRootState((state) => state.userInfo);
  const users = useRootState((state) => state.users);
  const [content, setContent] = useState("");
  const [haveFiles, setHaveFiles] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddUserRelated, setIsAddUserRelated] = useState(false);
  const [userRelated, setUserRelated] = useState([]);
  const [deptRelated, setDeptRelated] = useState([]);
  const [type, setType] = useState(0);

  const handleUploadPost = async () => {
    setLoading(true);
    try {
      const res = await PostServices.uploadPost({
        title: "",
        content,
        created_user: userInfo?._id,
        attachments: files,
        show_type: type,
        related_user:
          type == 0
            ? users?.map((u) => u?._id)
            : type == 1
            ? [userInfo?._id]
            : type == 2
            ? []
            : type == 3
            ? deptRelated
            : userRelated,
      });

      setShow(false);
      setLoading(false);
      setContent("");
      setDeptRelated([]);
      setUserRelated([]);
      setType(0);
      setFiles([]);
      cbSuccess && cbSuccess();
      Toast("success", res.message);
    } catch (err) {
      setLoading(false);
      Toast("danger", err.response.data.message);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center justify-center gap-2 border-b pb-2 border-gray-300">
          <p className="font-bold text-lg">Tạo bài viết</p>
        </div>
      }
      open={show}
      footer={null}
      centered
      width={600}
      onCancel={() => setShow(false)}
    >
      <Spin spinning={loading}>
        <div className="flex flex-col gap-2 min-h-[350px] max-h-[700px] overflow-y-auto h-[500px] pr-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="border border-black" size={40} src={userInfo?.image} />
              <div>
                <a className="font-semibold hover:underline text-black cursor-pointer hover:text-black">
                  {userInfo?.display_name}
                </a>
                <Button
                  className="btn-gray !text-sm !font-semibold !px-2"
                  icon={
                    type == 0 ? (
                      <ImEarth className="w-4 h-4" />
                    ) : type == 1 ? (
                      <BiSolidLock className="w-4 h-4" />
                    ) : type == 2 ? (
                      <HiUsers className="w-4 h-4" />
                    ) : (
                      <FaUsers className="w-4 h-4" />
                    )
                  }
                  onClick={() => setIsAddUserRelated(true)}
                >
                  {type == 0
                    ? "Công khai"
                    : type == 1
                    ? "Chỉ mình tôi"
                    : type == 2
                    ? "Bạn bè"
                    : "Phòng ban hoặc cá nhân"}
                </Button>
              </div>
            </div>
          </div>
          <div>
            <TextArea
              rows={6}
              className="text-lg placeholder:text-gray-500"
              style={{
                resize: "none",
                border: "none",
                outline: "none",
                boxShadow: "none",
              }}
              placeholder={userInfo?.display_name + " ơi, bạn đang nghĩ gì thể?"}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          {haveFiles && <UploadImage files={files} setFiles={setFiles} />}
          <div className="p-2 border rounded-lg flex items-center gap-14">
            <p>Thêm vào bài viết của bạn</p>
            <div className="flex items-center gap-3 cursor-pointer">
              <FaPhotoVideo
                className="w-8 h-8"
                color="#45bd62"
                onClick={() => {
                  setHaveFiles(!haveFiles);
                }}
              />
              <HiLocationMarker className="w-8 h-8 text-red-500" />
              <AiOutlineFileGif className="w-8 h-8 text-green-800" />
              <MdOutlineEmojiEmotions className="w-8 h-8" color="#f7b928" />
              <RiLiveLine className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          <Button
            className={"btn-blue mt-2"}
            disabledClassName="mt-2"
            disabled={content.trim().length == 0}
            onClick={handleUploadPost}
          >
            Đăng
          </Button>
        </div>
        <UserRelated
          show={isAddUserRelated}
          setShow={setIsAddUserRelated}
          setUserRelated={setUserRelated}
          userRelated={userRelated}
          deptRelated={deptRelated}
          setDeptRelated={setDeptRelated}
          type={type}
          setType={setType}
        />
      </Spin>
    </Modal>
  );
};

const UserRelated = ({ show, setShow, userRelated, setUserRelated, deptRelated, setDeptRelated, type, setType }) => {
  return (
    <Modal
      title={
        <div className="flex items-center justify-center gap-2 border-b pb-2 border-gray-300">
          <p className="font-bold text-lg">Người liên quan đến bài viết</p>
        </div>
      }
      open={show}
      centered
      footer={null}
      onCancel={() => setShow(false)}
      width={600}
    >
      <div className="flex flex-col gap-2 min-h-[350px] max-h-[500px] overflow-y-auto h-[450px] pr-2">
        <div
          className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-200 cursor-pointer"
          onClick={() => {
            setType(0);
          }}
        >
          <div className="flex items-center gap-6">
            <ImEarth className="w-5 h-5" />
            <div>
              <p className="font-bold">Công khai</p>
              <p>Bất kỳ ai ở trong tổ chức</p>
            </div>
          </div>
          <Radio checked={type == 0} />
        </div>
        <div
          className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-200 cursor-pointer"
          onClick={() => {
            setType(1);
          }}
        >
          <div className="flex items-center gap-6">
            <BiSolidLock className="w-5 h-5" />
            <div>
              <p className="font-bold">Chỉ mình tôi</p>
              <p>Chỉ mình bạn</p>
            </div>
          </div>
          <Radio checked={type == 1} />
        </div>
        <div
          className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-200 cursor-pointer"
          onClick={() => {
            setType(2);
          }}
        >
          <div className="flex items-center gap-6">
            <HiUsers className="w-5 h-5" />
            <div>
              <p className="font-bold">Bạn bè</p>
              <p>Bạn bè của bạn</p>
            </div>
          </div>
          <Radio checked={type == 2} />
        </div>
        <div
          className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-200 cursor-pointer"
          onClick={() => {
            setType(3);
          }}
        >
          <div className="flex items-center gap-6">
            <AiFillSetting className="w-5 h-5" />
            <div>
              <p className="font-bold">Tùy chỉnh</p>
              <p>Phòng ban hoặc cá nhân</p>
            </div>
          </div>
          <Radio checked={type == 3 || type == 4} />
        </div>
        {(type == 3 || type == 4) && (
          <div>
            <div className="flex items-center justify-center gap-10 my-3">
              <Radio
                checked={type == 3}
                onChange={() => {
                  setType(3);
                  setUserRelated([]);
                }}
              >
                Phòng ban
              </Radio>
              <Radio
                checked={type == 4}
                onChange={() => {
                  setType(4);
                  setDeptRelated([]);
                }}
              >
                Cá nhân
              </Radio>
            </div>
            {type == 3 && (
              <SelectDepartment
                menuPlacement={"top"}
                isMulti
                isClearable
                className="w-full"
                value={deptRelated}
                onChange={(e) => {
                  if (!e) {
                    setDeptRelated([]);
                  } else {
                    setDeptRelated(e.map((i) => i?.value));
                  }
                }}
              />
            )}
            {type == 4 && (
              <SelectUsers
                isMulti
                isClearable
                menuPlacement={"top"}
                value={userRelated ?? []}
                onChange={(e) => {
                  setUserRelated(e.map((i) => i?.value));
                }}
              />
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default UploadPost;
