import { Spin, Upload } from "antd";
import Button from "../button";
import { AiOutlineUpload } from "react-icons/ai";
import { useState } from "react";
import UploadServices from "../../services/upload";
import Toast from "../noti";
import _ from "lodash";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

const UploadUi = ({ files, setFiles, customBtnUpload, maxFileUpload }) => {
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
      setFiles([...files, ...res.files]);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const beforeUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      Toast("danger", "Kích thước file phải nhỏ hơn 2MB!");
    }
    return isLt2M;
  };

  return (
    <Upload
      listType="picture"
      maxCount={maxFileUpload ? maxFileUpload : 5}
      fileList={[...files]}
      multiple
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
      {customBtnUpload ? (
        customBtnUpload
      ) : (
        <Button
          className={`btn-outlined  hover:!text-blue-500 !font-normal`}
          icon={loading ? <Spin /> : <AiOutlineUpload className="w-5 h-5" />}
        >
          Tải lên thư mục
        </Button>
      )}
    </Upload>
  );
};
export default UploadUi;
