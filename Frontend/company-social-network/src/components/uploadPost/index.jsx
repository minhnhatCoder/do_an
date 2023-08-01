import { Avatar, Modal, Spin, Upload } from "antd";
import React, { useState } from "react";
import { useRootState } from "../../store";
import Button from "../button";
import { BiSolidLock } from "react-icons/bi";
import TextArea from "antd/es/input/TextArea";
import { FaPhotoVideo } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { RiLiveLine } from "react-icons/ri";
import { AiOutlineFileGif, AiOutlineSmile, AiOutlineUpload } from "react-icons/ai";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import UploadImage from "../uploadImage";
import PostServices from "../../services/postServices";
import Toast from "../noti";

const UploadPost = ({ show, setShow }) => {
  const userInfo = useRootState((state) => state.userInfo);
  const [content, setContent] = useState("");
  const [haveFiles, setHaveFiles] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUploadPost = async () => {
    setLoading(true);
    try {
      const res = await PostServices.uploadPost({
        content,
        created_user: userInfo?._id,
        attachments: files,
        related_user: [],
      });

      setShow(false);
      setLoading(false);
      setContent("");
      setFiles([]);
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
      onCancel={() => setShow(false)}
    >
      <Spin spinning={loading}>
        <div className="flex flex-col gap-2 min-h-[350px] max-h-[500px] overflow-y-auto h-[350px] pr-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="border border-black" size={40} src={userInfo?.image} />
              <div>
                <a className="font-semibold hover:underline text-black cursor-pointer hover:text-black">
                  {userInfo?.display_name}
                </a>
                <Button className="btn-gray !text-sm !font-semibold !px-2" icon={<BiSolidLock className="w-4 h-4" />}>
                  Chỉ mình tôi
                </Button>
              </div>
            </div>
          </div>
          <div>
            <TextArea
              rows={6}
              className="text-lg placeholder:text-gray-500"
              style={{ resize: "none", border: "none", outline: "none", boxShadow: "none" }}
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
      </Spin>
    </Modal>
  );
};

export default UploadPost;
