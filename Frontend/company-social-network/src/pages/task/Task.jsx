/*
 * @description
 * @since         Saturday, 8 5th 2023, 21:48:07 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */
import { Button, Input, Tabs, Table, Tag, Space, Radio } from "antd";
import React, { useEffect, useState } from "react";
import { BiSearchAlt, BiSort, BiTask, BiTaskX } from "react-icons/bi";
import { LuClipboardList, LuSlidersHorizontal } from "react-icons/lu";
import { AiOutlinePlus } from "react-icons/ai";
import Edit from "./Edit";
import Detail from "./Detail";
import TasksServices from "../../services/tasksServices";
import { MdPendingActions } from "react-icons/md";
import { useRootState } from "../../store";

const Task = ({ currentProject }) => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({ title: "", is_mine: "mine" });
  const [showDetail, setShowDetail] = useState(false);
  const [page, setPage] = useState(1);
  const [show, setShow] = useState(false);
  const currentUser = useRootState((state) => state.userInfo);
  console.log(filter);

  const options = [
    {
      label: "Tất cả",
      value: "all",
    },
    {
      label: "Của tôi",
      value: "mine",
    },
  ];

  const items = [
    {
      key: "1",
      label: (
        <div className="flex ">
          <LuClipboardList className="w-6 h-6 mr-1" />
          <span>Cần làm</span>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div className="flex ">
          <MdPendingActions className="w-6 h-6 mr-1" />
          <span>Đang làm</span>
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div className="flex ">
          <BiTask className="w-6 h-6 mr-1" />
          <span>Hoàn thành</span>
        </div>
      ),
    },
    {
      key: "4",
      label: (
        <div className="flex ">
          <BiTaskX className="w-6 h-6 mr-1" />
          <span>Đã hủy</span>
        </div>
      ),
    },
  ];
  const onChangeTab = (key) => {
    console.log(key);
  };

  const columns = [
    {
      title: "Công việc",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <a
          onClick={() => {
            setShowDetail(true);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Người thực hiện",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Thời hạn",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Ưu tiên",
      key: "tags",
      dataIndex: "tags",
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "loser") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a>Delete</a>
        </Space>
      ),
    },
  ];
  const data = [
    {
      key: "1",
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
      tags: ["nice", "developer"],
    },
    {
      key: "2",
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
      tags: ["loser"],
    },
    {
      key: "3",
      name: "Joe Black",
      age: 32,
      address: "Sydney No. 1 Lake Park",
      tags: ["cool", "teacher"],
    },
  ];

  const getTasks = async (_page) => {
    try {
      let params = {};
      if (currentProject?._id == 0) {
        params = {
          limit: 10,
          page: _page ? _page : page,
          search: filter.title,
        };
      } else {
        params = {
          limit: 10,
          page: _page ? _page : page,
          search: filter.display_name,
          "project[eq]": currentProject?._id,
        };
      }
      if (filter.is_mine == "mine") {
        params["assigner#reciever[eq]"] = currentUser?._id;
      } else {
        params["related_user[in]"] = [currentUser?._id];
      }
      const res = await TasksServices.getTasks(params);
      setTasks(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTasks();
  }, [currentProject?._id, filter.is_mine]);
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
              options={options}
              onChange={(e) => {
                console.log(e);
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
            <Input placeholder="Tìm kiếm..." prefix={<BiSearchAlt />} />
          </div>
          <Button
            type="primary"
            icon={<AiOutlinePlus />}
            size={"middle"}
            className="flex items-center justify-center btn-blue"
            onClick={() => setShow(true)}
          >
            Tạo công việc
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <Tabs
          defaultActiveKey="1"
          items={items}
          onChange={onChangeTab}
          centered
        />

        <Table columns={columns} dataSource={data} pagination={false} />
        <Edit
          id={0}
          show={show}
          setShow={setShow}
          projectInfo={currentProject}
          getData={getTasks}
        />
        <Detail id={0} show={showDetail} setShow={setShowDetail} />
      </div>
    </div>
  );
};

export default Task;
