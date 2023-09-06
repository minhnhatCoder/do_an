import { Modal, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { Date, Editor, Select, Text } from "../../components/input";
import Upload from "../../components/uploadFiles";
import SelectUsers from "../../components/Select/Users";
import SelectProjects from "../../components/Select/Projects";
import SelectPriority from "../../components/Select/Priority";
import Tasks from "../../services/tasksServices";
import Toast from "../../components/noti";
import { useRootState } from "../../store";
import useSocketStore from "../../store/socketStore";

const Edit = ({ id, show, setShow, projectId, getData, taskParentId, disableProject }) => {
  const [infoEdit, setInfoEdit] = useState({});
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState("");
  const [relatedUsers, setRelatedUsers] = useState([]);
  const userInfo = useRootState((state) => state.userInfo);
  const socket = useSocketStore((state) => state.socket);

  const getTask = async () => {
    setLoading(true);
    try {
      const res = await Tasks.getTask(id);
      setInfoEdit((prev) => ({
        ...prev,
        title: res?.data?.title,
        priority: res?.data?.priority,
        start_date: res?.data?.start_date,
        end_date: res?.data?.end_date,
        related_user: res?.data?.related_user?.map((u) => u?._id),
        reciever: res?.data?.reciever?._id,
        project: res?.data?.project?._id,
      }));

      setDescription((prev) => res?.data?.description);
      setFiles(res?.data?.attachments);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const onUpdate = async () => {
    setLoading(true);
    const body = { ...infoEdit, attachments: files, description };
    if (taskParentId) body.parent_task = taskParentId;
    try {
      let res;
      if (id) {
        res = await Tasks.updateTask(id, { ...body, noti_content: "đã cập nhật thông tin công việc" });
        socket?.emit("sendNotification", {
          userIds: res.data.related_user?.filter((id) => id != userInfo?._id) || [],
          data: {
            content: `${userInfo?.display_name} đã cập nhật thông tin công việc`,
          },
        });
      } else {
        res = await Tasks.addTask(body);
        socket?.emit("sendNotification", {
          userIds: res.data?.related_user?.filter((id) => id != userInfo?._id) || [],
          data: {
            content: `${userInfo?.display_name} đã tạo công việc`,
          },
        });
      }
      setShow(false);
      setFiles([]);
      setInfoEdit({});
      setDescription("");
      getData();
      setLoading(false);
      Toast("success", res?.message);
    } catch (error) {
      setLoading(false);
      Toast("error", error?.response?.data?.message || error?.message);
    }
  };

  const getUserRelated = async () => {
    try {
      const res = await Tasks.getProject(projectId);
      setInfoEdit({ ...infoEdit, project: projectId });
      setRelatedUsers(res?.data?.related_user || []);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    show && id && getTask();
  }, [id, show]);
  useEffect(() => {
    show && !id && projectId && getUserRelated();
  }, [projectId, show]);

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
        !loading && onUpdate();
      }}
      onCancel={() => {
        setShow(false);
        setFiles([]);
        setInfoEdit();
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
            <Editor classname="w-full" title="Mô tả" value={description || ""} onChange={(e) => setDescription(e)} />
          </div>
          <div className="mt-5">
            <p className="mb-2">Tài liệu</p>
            <Upload files={files} setFiles={setFiles} />
          </div>
          <SelectProjects
            menuPlacement={"top"}
            title="Dự án"
            disabled={disableProject}
            required
            className="mt-5"
            value={infoEdit?.project}
            onChange={(e) => {
              setInfoEdit({ ...infoEdit, project: e?.value });
              setRelatedUsers(e?.related_user);
            }}
          />

          <div className="mt-5 w-full ">
            <SelectUsers
              menuPlacement={"top"}
              usersId={relatedUsers ?? []}
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
              usersId={relatedUsers ?? []}
              menuPlacement={"top"}
              title="Người liên quan"
              value={infoEdit?.related_user ?? []}
              onChange={(e) => {
                setInfoEdit({
                  ...infoEdit,
                  related_user: e.map((i) => i?.value),
                });
              }}
            />
          </div>
        </div>
      </Spin>
    </Modal>
  );
};

export default Edit;
