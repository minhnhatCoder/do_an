import { Upload } from "antd";
import Button from "../button";
import { AiOutlineUpload } from "react-icons/ai";

const UploadUi = ({ value, onChange, onRemove, title }) => {
  const fileList = [
    {
      uid: "0",
      name: "xxx.png",
      status: "uploading",
    },
    {
      uid: "-1",
      name: "yyy.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      thumbUrl: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
    {
      uid: "-2",
      name: "zzz.png",
      status: "error",
    },
  ];
  return (
    <Upload
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      listType="picture"
      maxCount={5}
      multiple
      onChange={(e) => {
        onChange && onChange(e);
      }}
      onRemove={(e) => {
        onRemove && onRemove(e);
      }}
      defaultFileList={[...fileList]}
    >
      <Button className={"btn-blue"} icon={<AiOutlineUpload className="w-5 h-5" />}>
        {title}
      </Button>
    </Upload>
  );
};
export default UploadUi;
