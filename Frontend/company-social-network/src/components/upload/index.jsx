import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";

const UploadUi = ({ value, onChange, onRemove }) => {
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
      thumbUrl:
        "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
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
      <Button icon={<UploadOutlined />}>Upload</Button>
    </Upload>
  );
};
export default UploadUi;
