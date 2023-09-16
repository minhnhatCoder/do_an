import { Avatar, Empty, Modal, Popconfirm, Rate, Slider, Space, Spin, Table, Tabs, Tag, Tooltip } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Priority from "../../components/priority";
import { HiOutlineUser, HiUsers } from "react-icons/hi2";
import { MdDateRange } from "react-icons/md";
import { FiClipboard } from "react-icons/fi";
import { TbProgress } from "react-icons/tb";
import { TbFileDescription } from "react-icons/tb";
import { BiCommentDetail, BiAddToQueue } from "react-icons/bi";
import { GoPaperclip } from "react-icons/go";
import AvatarUi from "../../components/avatar";
import { AnswerInput, AnswerComment } from "../../components/post/Comment";
import File from "../../components/file";
import TasksServices from "../../services/tasksServices";
import commentsServices from "../../services/commentServices";
import { convertTimeStampToString, timeAgo } from "../../helper/timeHelper";
import { Link } from "react-router-dom";
import AvatarGroupUi from "../../components/avatar/group";
import { useRootState } from "../../store";
import Edit from "./Edit";
import { GrEdit } from "react-icons/gr";
import { BsBriefcase, BsTrash } from "react-icons/bs";
import _ from "lodash";
import Toast from "../../components/noti";
import Status from "../../components/status";
import useSocketStore from "../../store/socketStore";
import { LiaGrinStars } from "react-icons/lia";

const Detail = ({ id, show, setShow, getTasks }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const currentUser = useRootState((state) => state.userInfo);
  const userInfo = useRootState((state) => state.userInfo);
  const socket = useSocketStore((state) => state.socket);

  const onChangeTab = (key) => {
    setActiveTab(key);
  };

  const getData = async () => {
    setLoading(true);
    try {
      const res = await TasksServices.getTask(id);
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const onChangePriority = async (_id) => {
    setLoading(true);
    try {
      const res = await TasksServices.updateTask(id, {
        priority: _id,
        noti_content: "đã cập nhật độ ưu tiên công việc",
      });

      socket?.emit("sendNotification", {
        userIds: data?.related_user?.map((u) => u?._id).filter((id) => id != userInfo?._id) || [],
        data: {
          content: `${userInfo?.display_name} đã cập nhật độ ưu tiên công việc`,
        },
      });

      setData({ ...data, priority: _id });
      getTasks && getTasks();
      Toast("success", res?.message);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const onChangeRate = async (number) => {
    setLoading(true);
    try {
      const res = await TasksServices.updateTask(id, {
        star: number,
        noti_content: "đã đánh giá công việc",
      });

      socket?.emit("sendNotification", {
        userIds: data?.related_user?.map((u) => u?._id).filter((id) => id != userInfo?._id) || [],
        data: {
          content: `${userInfo?.display_name} đã đánh giá công việc`,
        },
      });
      setData({ ...data, star: number });
      getTasks && getTasks();
      Toast("success", res?.message);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const onChangeStatus = async (_id) => {
    setLoading(true);
    const body = { status: _id };
    if (_id == 3) {
      body.progress = 99;
      body.star = 2;
    }
    if (_id == 4 || _id == 1) {
      body.progress = 0;
    }
    try {
      const res = await TasksServices.updateTask(id, { ...body, noti_content: "đã cập nhật trạng thái công việc" });
      socket?.emit("sendNotification", {
        userIds: data?.related_user?.map((u) => u?._id).filter((id) => id != userInfo?._id) || [],
        data: {
          content: `${userInfo?.display_name} đã cập nhật trạng thái công việc `,
        },
      });
      setData({ ...data, ...body });
      getTasks && getTasks();
      Toast("success", res?.message);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  const onChangeProgress = async (value) => {
    setLoading(true);
    try {
      const res = await TasksServices.updateTask(id, {
        progress: value,
        noti_content: "đã cập nhật tiến độ công việc",
      });
      socket?.emit("sendNotification", {
        userIds: data?.related_user?.map((u) => u?._id).filter((id) => id != userInfo?._id) || [],
        data: {
          content: `${userInfo?.display_name} đã cập nhật tiến độ công việc`,
        },
      });
      setData({ ...data, progress: value });
      Toast("success", res?.message);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  const debouncedChangeProgress = _.debounce(onChangeProgress, 500);
  const formatter = (value) => `${value}%`;

  useEffect(() => {
    show && id && getData();
  }, [show, id]);

  return (
    <Modal
      title={
        <div className="flex items-center justify-center gap-2 border-b pb-2 border-gray-300">
          <p className="font-bold text-lg text-center">{data?.title}</p>
        </div>
      }
      open={show}
      footer={null}
      centered
      onCancel={() => setShow(false)}
      width={850}
    >
      <Spin spinning={loading}>
        <div className="p-3  min-h-[650px] max-h-[1200px] overflow-y-auto h-[710px]">
          <div className="flex items-center">
            <div className="w-2/3 flex">
              <Priority id={data?.priority} hasTitle onChange={onChangePriority} />
            </div>
            <div className="flex items-center gap-2 w-1/3">
              <div className="flex items-center gap-2">
                <HiUsers className="w-5 h-5" />
                <p className="font-semibold">Người tham gia</p>
              </div>
              <AvatarGroupUi data={data?.related_user} max={3} />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3 mt-5 w-2/3">
              <div className="flex items-center gap-2">
                <HiOutlineUser className="w-5 h-5" />
                <p className="font-semibold">Người giao việc</p>
              </div>

              <div className="flex items-center gap-2">
                <AvatarUi data={data?.assigner} />
                <Link to={`/profile/${data?.assigner?._id}`}>{data?.assigner?.display_name}</Link>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-5 w-1/3">
              <div className="flex items-center gap-2">
                <BsBriefcase className="w-5 h-5" />
                <p className="font-semibold">Dự án</p>
              </div>

              <div className="flex items-center gap-2">
                <p className="font-bold">{data?.project?.title}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3 mt-5 w-2/3">
              <div className="flex items-center gap-2">
                <HiOutlineUser className="w-5 h-5" />
                <p className="font-semibold">Người nhận việc</p>
              </div>

              <div className="flex items-center gap-2">
                <AvatarUi data={data?.reciever} />
                <Link to={`/profile/${data?.reciever?._id}`}>{data?.reciever?.display_name}</Link>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-5 w-1/3">
              <div className="flex items-center gap-2">
                <TbProgress className="w-5 h-5" />
                <p className="font-semibold">Tiến độ</p>
              </div>

              <Slider
                className="w-40"
                disabled={data?.status != 2}
                tooltip={{
                  formatter,
                }}
                defaultValue={data?.progress}
                onChange={(e) => debouncedChangeProgress(e)}
              />
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3 w-2/3">
              <div className="flex items-center gap-3 mt-5">
                <div className="flex items-center gap-2">
                  <MdDateRange className="w-5 h-5" />
                  <p className="font-semibold">Thời gian</p>
                </div>

                <div className="flex items-center gap-2">
                  <p>{convertTimeStampToString(data?.start_date, "right")}</p>
                  <p> - {convertTimeStampToString(data?.end_date, "right")}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4 w-1/3">
              <div className="flex items-center gap-2">
                <LiaGrinStars className="w-5 h-5" />
                <p className="font-semibold">Đánh giá</p>
              </div>

              <Rate
                disabled={data?.status != 3}
                value={data?.star}
                onChange={(e) => {
                  onChangeRate(e);
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-5 mb-3">
            <div className="flex items-center gap-2">
              <FiClipboard className="w-5 h-5" />
            </div>
            <Status id={data?.status} hasTitle onChange={onChangeStatus} />
          </div>
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: "1",
                label: (
                  <div className="flex ">
                    <TbFileDescription className="w-5 h-5 mr-1" />
                    <span>Mô tả</span>
                  </div>
                ),
              },
              {
                key: "2",
                label: (
                  <div className="flex ">
                    <BiCommentDetail className="w-5 h-5 mr-1" />
                    <span>Bình luận</span>
                  </div>
                ),
              },
              {
                key: "3",
                label: (
                  <div className="flex ">
                    <GoPaperclip className="w-5 h-5 mr-1" />
                    <span>Tài liệu đính kèm</span>
                  </div>
                ),
              },
              {
                key: "4",
                label: (
                  <div className="flex ">
                    <BiAddToQueue className="w-5 h-5 mr-1" />
                    <span>Công việc con</span>
                  </div>
                ),
              },
            ]}
            onChange={onChangeTab}
            centered
          />

          {activeTab == 1 && <DescTab data={data?.description} />}
          {activeTab == 2 && <CommentTab id={data?._id} currentUser={currentUser} data={data} />}
          {activeTab == 3 && <AttachmentTab data={data?.attachments} />}
          {activeTab == 4 && <SubTaskTab id={data?._id} projectId={data?.project?._id} />}
        </div>
      </Spin>
    </Modal>
  );
};

export default Detail;

const DescTab = ({ data }) => {
  if (!data) return <Empty />;
  return <div className="" dangerouslySetInnerHTML={{ __html: data }} />;
};
const CommentTab = ({ id, currentUser, data }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [files, setFiles] = useState([]);
  const scrollRef = useRef(null);
  const userInfo = useRootState((state) => state.userInfo);
  const socket = useSocketStore((state) => state.socket);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const getComments = async () => {
    setLoading(true);
    try {
      const res = await commentsServices.getComments({ "target[eq]": id, sort: "created_at", limit: 100000 });
      setComments(res.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  const onComment = async () => {
    setLoading(true);
    try {
      const res = await TasksServices.commentTask(id, {
        content: content,
        attachments: files,
      });
      socket?.emit("sendNotification", {
        userIds: data?.related_user?.map((u) => u?._id).filter((id) => id != userInfo?._id) || [],
        data: {
          content: `${userInfo?.display_name} đã bình luận công việc`,
        },
      });
      socket?.emit("sendMessage", {
        userIds: data?.related_user?.map((u) => u?._id),
        data: { ...res?.data, type: "task" },
      });
      setContent("");
      setFiles([]);
      await getComments();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getComments();
  }, []);
  useEffect(() => {
    if (scrollRef.current) {
      const innerElement = scrollRef.current.lastChild;
      if (innerElement) {
        innerElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [comments?.length]);

  useEffect(() => {
    socket &&
      socket?.on("getMessage", (mess) => {
        mess && mess?.type == "task" && setArrivalMessage(mess);
      });
  }, [socket]);

  useEffect(() => {
    arrivalMessage && arrivalMessage?.target == id && setComments([...comments, arrivalMessage]);
  }, [arrivalMessage]);

  return (
    <div className="">
      <div className="max-h-[350px] min-h-[250px] h-[300px] overflow-y-auto" ref={scrollRef}>
        {comments?.length > 0 ? (
          comments.map((comment) => {
            if (comment.created_by?._id == currentUser?._id) {
              return (
                <div className="flex items-start gap-2 mt-2" key={comment?._id}>
                  <Avatar className="border border-black" size={40} src={comment?.created_by?.image} />
                  <div className="flex flex-col w-full">
                    <div className="px-3 py-2 bg-[#0084ff] rounded-2xl w-fit">
                      <div className="flex items-center gap-2">
                        <a className={`font-semibold hover:underline text-white cursor-pointer hover:text-white`}>
                          {comment?.created_by?.display_name}
                        </a>
                        <Tooltip placement="right" title={convertTimeStampToString(comment?.created_at, "right")}>
                          <p className="font-semibold hover:underline text-xs cursor-pointer text-gray-200">
                            {timeAgo(comment?.created_at)}
                          </p>
                        </Tooltip>
                      </div>

                      <p className="text-white" dangerouslySetInnerHTML={{ __html: comment?.content }} />
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <div className="flex items-start gap-2 mt-2" key={comment?._id}>
                <Avatar className="border border-black" size={40} src={comment?.created_by?.image} />
                <div className="flex flex-col w-full">
                  <div className="px-3 py-2 bg-[#f0f2f5] rounded-2xl w-fit">
                    <div className="flex items-center gap-2">
                      <a className={`font-semibold hover:underline text-black cursor-pointer hover:text-black`}>
                        {comment?.created_by?.display_name}
                      </a>
                      <p className="font-semibold hover:underline text-xs cursor-pointer text-gray-500">
                        {timeAgo(comment?.created_at)}
                      </p>
                    </div>

                    <p dangerouslySetInnerHTML={{ __html: comment?.content }} />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <Empty />
        )}
      </div>
      <div>
        <AnswerInput content={content} setContent={setContent} onComment={onComment} loading={loading} />
      </div>
    </div>
  );
};
const AttachmentTab = ({ data }) => {
  if (_.isEmpty(data)) return <Empty />;
  return (
    <div className=" max-h-[450px] min-h-[350px] overflow-y-auto">
      <File data={data} />
    </div>
  );
};
const SubTaskTab = ({ id, projectId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState("");
  const [show, setShow] = useState(false);

  const getTasks = async () => {
    setLoading(true);
    try {
      let params = {
        limit: 100000,
        "parent_task[eq]": id,
      };
      const res = await TasksServices.getTasks(params);
      setData(
        res?.data.map((task) => ({
          key: task?._id,
          title: task?.title,
          reciever: task.reciever,
          time:
            convertTimeStampToString(task.start_date, "right") +
            " - " +
            convertTimeStampToString(task.end_date, "right"),
          priority: task.priority,
          status: task.status,
        }))
      );
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    id && getTasks();
  }, [id]);
  const handleDelete = async (_id) => {};
  return (
    <div className="">
      <p
        className="text-blue-500 hover:text-orange-500 pb-2 text-right cursor-pointer"
        onClick={() => {
          setShow(true);
          setCurrentTaskId("");
        }}
      >
        + Thêm công việc con
      </p>
      <Table
        loading={loading}
        columns={[
          {
            title: "Công việc",
            dataIndex: "title",
            key: "title",
            render: (text, { key }) => (
              <a
                onClick={() => {
                  setShowDetail(true);
                  setCurrentTaskId(key);
                }}
              >
                {text}
              </a>
            ),
          },
          {
            title: "Người thực hiện",
            dataIndex: "receiver",
            key: "receiver",
            render: (_, { reciever }) => {
              return (
                <div className="flex items-center gap-2">
                  <Avatar src={reciever?.image} size="large" />
                  <Link to={`/profile/${reciever?._id}`} className="font-semibold">
                    {reciever?.display_name}
                  </Link>
                </div>
              );
            },
          },
          {
            title: "Thời hạn",
            dataIndex: "time",
            key: "time",
          },
          {
            title: "Ưu tiên",
            key: "priority",
            dataIndex: "priority",
            render: (priority) => {
              switch (priority) {
                case 1:
                  return <Tag color="red">Cao</Tag>;
                case 2:
                  return <Tag color="orange">Trung bình</Tag>;
                case 3:
                  return <Tag color="blue">Thấp</Tag>;
                case 4:
                  return <Tag color="gray">Không ưu tiên</Tag>;

                default:
                  return <Tag color="red">Cao</Tag>;
              }
            },
          },
          {
            title: "Hành động",
            key: "action",
            render: (_, { key }) => (
              <Space>
                <GrEdit
                  className="w-5 h-5 cursor-pointer hover:!text-blue-500"
                  onClick={() => {
                    setCurrentTaskId(key);
                    setShow(true);
                  }}
                />
                <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete()}>
                  <BsTrash className="w-5 h-5 cursor-pointer hover:text-blue-500" />
                </Popconfirm>
              </Space>
            ),
          },
        ]}
        dataSource={data}
        pagination={false}
      />
      <Edit
        id={currentTaskId}
        show={show}
        setShow={setShow}
        getData={getTasks}
        taskParentId={id}
        projectId={projectId}
        disableProject
      />
      <Detail id={currentTaskId} show={showDetail} setShow={setShowDetail} getTasks={getTasks} />
    </div>
  );
};
