import { Dropdown, Input, Table } from "antd";
import React, { useState } from "react";
import { AiOutlineMessage } from "react-icons/ai";
import {
  BiSearchAlt,
  BiSolidRightArrow,
  BiSolidDownArrow,
} from "react-icons/bi";
import { FcFolder, FcOpenedFolder } from "react-icons/fc";
import { FiMoreHorizontal } from "react-icons/fi";
import { RxAvatar } from "react-icons/rx";

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    members: `Edward King ${i}`,
    email: "abc1234@gmail",
    phone: `0998336554`,
    position: {
      dept: "BOD",
      role: "Giám đốc",
    },
    status: "Active",
  });
}

const Friends = () => {
  const [tabs, setTabs] = useState([
    { title: "Thành viên trong tổ chức" },
    { title: "Tất cả bạn bè" },
    { title: "Lời mời kết bạn" },
    { title: "Gợi ý kết bạn" },
  ]);
  const columns = [
    {
      title: "Thành viên",
      dataIndex: "members",
      width: 250,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 250,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      width: 250,
    },
    {
      title: "Vị trí công việc",
      dataIndex: "position",
      width: 250,
      render: (value) => (
        <div>
          <p className="font-bold">{value?.dept}</p>
          <p className="font-light text-neutral-400">{value?.role}</p>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 150,
    },
    {
      title: "",
      dataIndex: "",
      width: 50,
      render: () => {
        const items = [
          {
            key: "1",
            label: <a className="font-semibold">Nhắn tin</a>,
            icon: <AiOutlineMessage className="w-5 h-5" />,
          },
          {
            key: "2",
            label: <a className="font-semibold">Xem trang cá nhân</a>,
            icon: <RxAvatar className="w-5 h-5" />,
          },
        ];
        return (
          <div>
            <Dropdown
              trigger={"click"}
              placement="bottomLeft"
              menu={{
                items,
              }}
            >
              <FiMoreHorizontal
                className="w-6 h-6 cursor-pointer"
                color="#28526e"
              />
            </Dropdown>
          </div>
        );
      },
    },
  ];
  return (
    <div className="main-content h-full">
      <div className="flex gap-2 overflow-y-auto h-full bg-white rounded-lg">
        <div className="w-1/4 p-3 border-r">
          <p className="font-bold text-lg mb-2">Công ty Facebook</p>
          <div className="flex items-center justify-center gap-2 mb-3">
            <Input placeholder="Tìm kiếm..." prefix={<BiSearchAlt />} />
          </div>
          <div>
            <DeptFolder />
            <DeptFolder />
            <DeptFolder />
            <DeptFolder />
            <DeptFolder />
            <DeptFolder />
            <DeptFolder />
            <DeptFolder />
          </div>
        </div>
        <div className="w-3/4 p-3">
          <div className="flex items-center justify-between">
            <p className="font-bold text-xl">Getfly</p>
            <div className="flex items-center justify-center gap-2">
              <Input placeholder="Tìm kiếm..." prefix={<BiSearchAlt />} />
            </div>
          </div>
          <div className="mt-4">
            <Table
              columns={columns}
              dataSource={data}
              pagination={false}
              scroll={{
                y: 500,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;

const DeptFolder = ({ data }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex items-center gap-2 mb-2">
      {data?.dept_child?.length > 0 ? (
        show ? (
          <BiSolidDownArrow className="w-3 h-3" />
        ) : (
          <BiSolidRightArrow className="w-3 h-3" />
        )
      ) : (
        <div className="w-3" />
      )}
      {show ? (
        <FcOpenedFolder
          className="w-8 h-8"
          onClick={() => {
            data?.dept_child?.length > 0 && setShow(false);
          }}
        />
      ) : (
        <FcFolder
          className="w-8 h-8"
          onClick={() => {
            data?.dept_child?.length > 0 && setShow(true);
          }}
        />
      )}

      <p className="font-bold">BOD</p>
      {show && <DeptFolder />}
    </div>
  );
};
