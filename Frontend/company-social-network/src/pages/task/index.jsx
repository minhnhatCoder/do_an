import { Button, Input, Tabs, Space, Table, Tag } from "antd";
import React, { useState } from "react";
import { BiPlus, BiSearchAlt, BiSort, BiTask, BiTaskX } from "react-icons/bi";
import { MdPendingActions } from "react-icons/md";
import { LuClipboardList, LuSlidersHorizontal } from "react-icons/lu";
import { AiOutlineEye, AiOutlinePlus, AiOutlineFundProjectionScreen } from "react-icons/ai";
import { CiGrid41 } from "react-icons/ci";
import Edit from "./Edit";
import Detail from "./Detail";

const Tasks = () => {
  const [show, setShow] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
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

  return (
    <div className="main-content h-full">
      <div className="flex gap-2 overflow-y-auto h-full bg-white rounded-lg">
        <div className="w-1/4 p-3 border-r">
          <p className="font-bold text-lg mb-2">Quản lý công việc</p>

          <div className="p-3">
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded-md">
              <CiGrid41 className="w-7 h-7" />
              <p className="font-bold"> Công việc của tôi</p>
            </div>
            <div className="mt-3">
              <p className="font-bold text-lg mb-2">Tất cả dự án</p>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded-md mt-2">
                <AiOutlineFundProjectionScreen className="w-7 h-7" />
                <p className="font-bold"> Dự án 1</p>
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded-md mt-2">
                <AiOutlineFundProjectionScreen className="w-7 h-7" />
                <p className="font-bold"> Dự án 1</p>
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded-md mt-2">
                <AiOutlineFundProjectionScreen className="w-7 h-7" />
                <p className="font-bold"> Dự án 1</p>
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded-md mt-2">
                <AiOutlineFundProjectionScreen className="w-7 h-7" />
                <p className="font-bold"> Dự án 1</p>
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded-md mt-2">
                <AiOutlineFundProjectionScreen className="w-7 h-7" />
                <p className="font-bold"> Dự án 1</p>
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded-md mt-2">
                <AiOutlineFundProjectionScreen className="w-7 h-7" />
                <p className="font-bold"> Dự án 1</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-3/4 p-3">
          <p className="font-bold text-xl">Công việc của tôi</p>
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
                <AiOutlineEye className="w-4 h-4" />
                <p>Đến hạn hôm nay</p>
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
            <Tabs defaultActiveKey="1" items={items} onChange={onChangeTab} centered />

            <Table columns={columns} dataSource={data} pagination={false} />
            <Edit id={0} show={show} setShow={setShow} />
            <Detail id={0} show={showDetail} setShow={setShowDetail} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
