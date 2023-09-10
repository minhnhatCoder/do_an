/*
 * @description
 * @since         Sunday, 7 23rd 2023, 21:32:32 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */
import { Spin, Upload } from "antd";
import React, { useState } from "react";
import Button from "../button";
import { AiOutlineUpload } from "react-icons/ai";
import UploadServices from "../../services/upload";
import Toast from "../noti";
import _ from "lodash";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

const UploadImage = ({ files, setFiles, type, customButton, maxFileUpload }) => {
  const [loading, setLoading] = useState(false);
  const handleChange = async (info) => {
    setLoading(true);
    try {
      // Get this url from response in real world.
      const formData = new FormData();
      _.forEach(info.fileList, (file) => {
        formData.append("files", file.originFileObj);
      });
      const res = await UploadServices.uploadImage(formData);
      if (type == "avatar") {
        setFiles(res.files);
      } else setFiles([...files, ...res.files]);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
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

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  if (type == "avatar") {
    return (
      <Upload
        listType="picture-circle"
        fileList={[...files]}
        multiple
        showUploadList={false}
        maxCount={1}
        beforeUpload={beforeUpload}
        disabled={loading}
        onChange={handleChange}
        onRemove={(e) => {
          setFiles([]);
        }}
      >
        {files?.length > 0 ? (
          <img src={files?.[0]?.url} alt="avatar" className="w-24 h-24 object-cover rounded-full" />
        ) : (
          uploadButton
        )}
      </Upload>
    );
  } else
    return (
      <Upload
        listType="picture"
        fileList={[...files]}
        className={`upload-list-inline`}
        multiple
        maxCount={maxFileUpload ? maxFileUpload : 5}
        beforeUpload={beforeUpload}
        disabled={loading}
        onChange={handleChange}
        onRemove={(e) => {
          setFiles(
            files.filter((file) => {
              return file.uid !== e.uid;
            })
          );
        }}
      >
        {customButton ? (
          customButton
        ) : (
          <Button className={`btn-outlined  `} icon={loading ? <Spin /> : <AiOutlineUpload className="w-5 h-5" />}>
            Tải ảnh lên
          </Button>
        )}
      </Upload>
    );
};

export default UploadImage;
