import { Modal, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { Date, Editor, Select, Text } from "../../components/input";
import Upload from "../../components/uploadFiles";
import SelectUsers from "../../components/Select/Users";
import SelectProjects from "../../components/Select/Projects";
import SelectPriority from "../../components/Select/Priority";
import Tasks from "../../services/tasksServices";
import Toast from "../../components/noti";

const Edit = ({ id, show, setShow, projectId, getData }) => {
  const [infoEdit, setInfoEdit] = useState({});
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  useEffect(() => {
    projectId && setInfoEdit({ ...infoEdit, project: projectId });
  }, [projectId]);

  const onUpdate = async () => {
    setLoading(true);
    try {
      let res;
      if (id) {
        res = await Tasks.updateTask(id, { ...infoEdit, attachments: files });
      } else {
        res = await Tasks.addTask({ ...infoEdit, attachments: files });
        setShow(false);
        setFiles([]);
        setInfoEdit({});
        getData();
        setLoading(false);
        Toast("success", res?.message);
      }
    } catch (error) {
      setLoading(false);
      Toast("error", error?.response?.data?.message);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center justify-center gap-2 border-b pb-2 border-gray-300">
          <p className="font-bold text-lg text-center">{id ? "Sửa công việc" : "Tạo công việc"}</p>
        </div>
      }
      open={show}
      //   footer={null}
      centered
      onOk={() => {
        onUpdate();
      }}
      onCancel={() => {
        setShow(false);
        setFiles([]);
        setInfoEdit({});
      }}
      width={900}
    >
      <Spin spinning={loading}>
        <div className="p-3  min-h-[700px] max-h-[1000px] overflow-y-auto h-[350px]">
          <Text
            classname="w-full"
            title="Tên công việc"
            value={infoEdit?.title}
            required
            onChange={(e) => setInfoEdit({ ...infoEdit, title: e.target.value })}
          />
          <div className="mt-5 w-full ">
            <SelectPriority
              title="Mức dộ ưu tiên"
              required
              value={infoEdit?.priority}
              onChange={(e) => setInfoEdit({ ...infoEdit, priority: e?.value })}
            />
          </div>

          <div className="flex items-center justify-center gap-3 mt-5 w-full">
            <div className="w-1/2">
              <Date
                title="Ngày bắt đầu"
                required
                type="date-time"
                value={infoEdit?.start_date}
                onChange={(e) => setInfoEdit({ ...infoEdit, start_date: e })}
              />
            </div>

            <div className="w-1/2">
              <Date
                title="Ngày kết thúc"
                required
                type="date-time"
                value={infoEdit?.end_date}
                onChange={(e) => setInfoEdit({ ...infoEdit, end_date: e })}
              />
            </div>
          </div>
          <div className="mt-5 w-full">
            <Editor
              classname="w-full"
              title="Mô tả"
              value={infoEdit?.description}
              onChange={(e) => setInfoEdit({ ...infoEdit, description: e })}
            />
          </div>
          <div className="mt-5">
            <p className="mb-2">Tài liệu</p>
            <Upload files={files} setFiles={setFiles} />
          </div>
          <SelectProjects
            menuPlacement={"top"}
            title="Dự án"
            required
            className="mt-5"
            value={infoEdit?.project}
            onChange={(e) => {
              setInfoEdit({ ...infoEdit, project: e?.value });
            }}
          />

          <div className="mt-5 w-full ">
            <SelectUsers
              menuPlacement={"top"}
              title="Người nhận việc"
              required
              value={infoEdit?.reciever}
              onChange={(e) => {
                setInfoEdit({ ...infoEdit, reciever: e?.value });
              }}
            />
          </div>
          <div className="mt-5 w-full">
            <SelectUsers
              isMulti
              isClearable
              menuPlacement={"top"}
              title="Người liên quan"
              value={infoEdit?.related_user ?? []}
              onChange={(e) => {
                setInfoEdit({ ...infoEdit, related_user: e.map((i) => i?.value) });
              }}
            />
          </div>
        </div>
      </Spin>
    </Modal>
  );
};

export default Edit;
