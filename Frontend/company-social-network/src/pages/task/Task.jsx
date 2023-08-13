/*
 * @description
 * @since         Saturday, 8 5th 2023, 21:48:07 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */
import { Button, Input, Tabs, Table, Tag, Space, Radio, Avatar, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import { BiSearchAlt, BiSort, BiTask, BiTaskX } from "react-icons/bi";
import { LuClipboardList, LuSlidersHorizontal } from "react-icons/lu";
import { AiOutlinePlus } from "react-icons/ai";
import Edit from "./Edit";
import Detail from "./Detail";
import TasksServices from "../../services/tasksServices";
import { MdPendingActions } from "react-icons/md";
import { useRootState } from "../../store";
import { convertTimeStampToString } from "../../helper/timeHelper";
import { Link } from "react-router-dom";
import { BsTrash } from "react-icons/bs";
import { GrEdit } from "react-icons/gr";

const Task = ({ currentProject }) => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({ title: "", is_mine: "mine", status: 1 });
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [show, setShow] = useState(false);
  const currentUser = useRootState((state) => state.userInfo);
  const [currentTaskId, setCurrentTaskId] = useState(0);

  const getTasks = async (_page) => {
    setLoading(true);
    try {
      let params = {};
      if (currentProject?._id == 0) {
        params = {
          limit: 10,
          page: _page ? _page : page,
          search: filter.title,
          status: filter.status,
        };
      } else {
        params = {
          limit: 10,
          page: _page ? _page : page,
          search: filter.display_name,
          "project[eq]": currentProject?._id,
          status: filter.status,
        };
      }
      if (filter.is_mine == "mine") {
        params["assigner#reciever[eq]"] = currentUser?._id;
      } else {
        params["related_user[in]"] = [currentUser?._id];
      }
      const res = await TasksServices.getTasks(params);
      setTasks(
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
  const handleDelete = async (_id) => {};

  useEffect(() => {
    getTasks();
  }, [currentProject?._id, JSON.stringify(filter)]);
  return (
    <div className="w-3/4 p-3">
      <p className="font-bold text-xl">{currentProject?.title}</p>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center justify-center gap-1 cursor-pointer hover:bg-gray-100 p-1 rounded-md">
            <LuSlidersHorizontal className="w-4 h-4" />
            <p>Bộ lọc</p>
          </div>
          <div className="flex items-center justify-center gap-1 cursor-pointer hover:bg-gray-100 p-1 rounded-md">
            <BiSort className="w-4 h-4" />
            <p>Sắp xếp</p>
          </div>
          <div className="flex items-center justify-center gap-1 cursor-pointer hover:bg-gray-100 p-1 rounded-md">
            <Radio.Group
              options={[
                {
                  label: "Tất cả",
                  value: "all",
                },
                {
                  label: "Của tôi",
                  value: "mine",
                },
              ]}
              onChange={(e) => {
                setFilter({ ...filter, is_mine: e.target.value });
              }}
              value={filter?.is_mine}
              optionType="button"
              buttonStyle="solid"
            />
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center justify-center gap-2">
            <Input
              placeholder="Tìm kiếm..."
              prefix={<BiSearchAlt />}
              value={filter?.title}
              onChange={(e) => setFilter({ ...filter, title: e.target.value })}
            />
          </div>
          <Button
            type="primary"
            icon={<AiOutlinePlus />}
            size={"middle"}
            className="flex items-center justify-center btn-blue"
            onClick={() => {
              setShow(true);
              setCurrentTaskId("");
            }}
          >
            Tạo công việc
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <Tabs
          defaultActiveKey={1}
          items={[
            {
              key: 1,
              label: (
                <div className="flex ">
                  <LuClipboardList className="w-6 h-6 mr-1" />
                  <span>Cần làm</span>
                </div>
              ),
            },
            {
              key: 2,
              label: (
                <div className="flex ">
                  <MdPendingActions className="w-6 h-6 mr-1" />
                  <span>Đang làm</span>
                </div>
              ),
            },
            {
              key: 3,
              label: (
                <div className="flex ">
                  <BiTask className="w-6 h-6 mr-1" />
                  <span>Hoàn thành</span>
                </div>
              ),
            },
            {
              key: 4,
              label: (
                <div className="flex ">
                  <BiTaskX className="w-6 h-6 mr-1" />
                  <span>Đã hủy</span>
                </div>
              ),
            },
          ]}
          onChange={(e) => {
            setFilter({ ...filter, status: Number(e) });
          }}
          centered
        />

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
              title: "Hành dộng",
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
          dataSource={tasks}
          pagination={false}
        />
        <Edit id={currentTaskId} show={show} setShow={setShow} projectId={currentProject?._id} getData={getTasks} />
        <Detail id={currentTaskId} show={showDetail} setShow={setShowDetail} getTasks={getTasks} />
      </div>
    </div>
  );
};

export default Task;
