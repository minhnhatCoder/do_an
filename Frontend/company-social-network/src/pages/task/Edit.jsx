import { Modal } from "antd";
import React, { useState } from "react";
import { Date, Editor, Select, Text } from "../../components/input";
import Upload from "../../components/uploadFiles";

const Edit = ({ id, show, setShow }) => {
  const [infoEdit, setInfoEdit] = useState({});
  const [loading, setLoading] = useState(false);
  return (
    <Modal
      title={
        <div className="flex items-center justify-center gap-2 border-b pb-2 border-gray-300">
          <p className="font-bold text-lg text-center">Tạo công việc</p>
        </div>
      }
      open={show}
      //   footer={null}
      centered
      onCancel={() => setShow(false)}
      width={900}
    >
      <div className="p-3  min-h-[700px] max-h-[1000px] overflow-y-auto h-[350px]">
        <Text
          classname="w-full"
          title="Tên công việc"
          value={infoEdit?.task_name}
          required
          onChange={(e) => setInfoEdit({ task_name: e, ...infoEdit })}
        />
        <div className="mt-5 w-full ">
          <Select
            title="Mức dộ ưu tiên"
            required
            // value={infoEdit?.task_name}
            // onChange={(e) => setInfoEdit({ task_description: e, ...infoEdit })}
          />
        </div>

        <div className="flex items-center justify-center gap-3 mt-5">
          <Date
            classname="w-1/2"
            title="Ngày bắt đầu"
            // value={infoEdit?.task_name}
            required
            type="date-time"
            onChange={(value, dateString) => {
              console.log("Selected Time: ", value);
              console.log("Formatted Selected Time: ", dateString);
            }}
          />

          <Date
            classname="w-1/2"
            title="Ngày kết thúc"
            // value={infoEdit?.task_name}
            required
            type="date-time"
            onChange={(value, dateString) => {
              console.log("Selected Time: ", value);
              console.log("Formatted Selected Time: ", dateString);
            }}
          />
        </div>
        <div className="mt-5 w-full">
          <Editor
            classname="w-full"
            title="Mô tả"
            value={infoEdit?.task_name}
            onChange={(e) => setInfoEdit({ task_description: e, ...infoEdit })}
          />
        </div>
        <div className="mt-5">
          <Upload title={"Tài liệu"} />
        </div>
        <div className="mt-5 w-full ">
          <Select
            menuPlacement={"top"}
            title="Người nhận việc"
            required
            // value={infoEdit?.task_name}
            // onChange={(e) => setInfoEdit({ task_description: e, ...infoEdit })}
          />
        </div>
        <div className="mt-5 w-full">
          <Select
            isMulti
            isClearable
            menuPlacement={"top"}
            title="Người liên quan"
            // value={infoEdit?.task_name}
            // onChange={(e) => setInfoEdit({ task_description: e, ...infoEdit })}
          />
        </div>
      </div>
    </Modal>
  );
};

export default Edit;
