import { Avatar, Empty, Modal, Tabs, Tooltip } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Priority from "../../components/priority";
import { HiOutlineUser, HiUsers } from "react-icons/hi2";
import { MdDateRange } from "react-icons/md";
import { FiClipboard } from "react-icons/fi";
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

const Detail = ({ id, show, setShow }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const currentUser = useRootState((state) => state.userInfo);

  let status = [
    {
      key: 1,
      label: "Cần làm",
      color: "text-blue-500",
    },
    {
      key: 2,
      label: "Đang làm",
      color: "text-orange-500",
    },
    {
      key: 3,
      label: "Hoàn thành",
      color: "text-green-500",
    },
    {
      key: 4,
      label: "Đã hủy",
      color: "text-red-500",
    },
  ];
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
      width={650}
    >
      <div className="p-3  min-h-[700px] max-h-[1200px] overflow-y-auto h-[810px]">
        <div className="flex items-center justify-between">
          <Priority id={data.priority} hasTitle onChange />
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <HiUsers className="w-5 h-5" />
              <p className="font-semibold">Người tham gia</p>
            </div>
            <AvatarGroupUi data={data?.related_user} max={3} />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5">
          <div className="flex items-center gap-2">
            <HiOutlineUser className="w-5 h-5" />
            <p className="font-semibold">Người giao việc</p>
          </div>

          <div className="flex items-center gap-2">
            <AvatarUi data={data?.assigner} />
            <Link to={`/profile/${data?.assigner?._id}`}>{data?.assigner?.display_name}</Link>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-5">
          <div className="flex items-center gap-2">
            <HiOutlineUser className="w-5 h-5" />
            <p className="font-semibold">Người nhận việc</p>
          </div>

          <div className="flex items-center gap-2">
            <AvatarUi data={data?.reciever} />
            <Link to={`/profile/${data?.reciever?._id}`}>{data?.reciever?.display_name}</Link>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-5">
          <div className="flex items-center gap-2">
            <MdDateRange className="w-5 h-5" />
            <p className="font-semibold">Thời gian</p>
          </div>

          <div className="flex items-center gap-2">
            <p>{convertTimeStampToString(data.start_date, "right")}</p>
            <p> - {convertTimeStampToString(data.end_date, "right")}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-5 mb-3">
          <div className="flex items-center gap-2">
            <FiClipboard className="w-5 h-5" />
            <p className="font-semibold">Trạng thái</p>
          </div>
          <p className={`font-bold ${status.find((s) => s?.key == data?.status)?.color}`}>
            {status.find((s) => s?.key == data?.status)?.label}
          </p>
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
        {activeTab == 2 && <CommentTab id={data?._id} currentUser={currentUser} />}
        {activeTab == 3 && <AttachmentTab data={data?.attachments} />}
        {activeTab == 4 && <SubTaskTab />}
      </div>
    </Modal>
  );
};

export default Detail;

const DescTab = ({ data }) => {
  if (!data) return <Empty />;
  return <div className="p-3" dangerouslySetInnerHTML={{ __html: data }} />;
};
const CommentTab = ({ id, currentUser }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [files, setFiles] = useState([]);
  const scrollRef = useRef(null);
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
      await TasksServices.commentTask(id, {
        content: content,
        attachments: files,
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
  return (
    <div className="p-3 ">
      <div className="max-h-[395px] min-h-[395px] overflow-y-auto" ref={scrollRef}>
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
  if (!data) return <Empty />;
  return (
    <div className="p-3 max-h-[450px] min-h-[450px] overflow-y-auto">
      <File data={data} />
    </div>
  );
};
const SubTaskTab = ({ data }) => {
  if (!data) return <Empty />;
  return <div className="p-3"></div>;
};
