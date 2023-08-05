import { Button, Input, Tabs, Space, Table, Tag, Empty } from "antd";
import React, { useEffect, useState } from "react";
import { BiSearchAlt, BiSort, BiTask, BiTaskX } from "react-icons/bi";
import { MdPendingActions } from "react-icons/md";
import { LuClipboardList, LuSlidersHorizontal } from "react-icons/lu";
import { AiOutlinePlus } from "react-icons/ai";
import { CiGrid41 } from "react-icons/ci";
import Edit from "./Edit";
import EditProject from "./EditProject";
import Detail from "./Detail";
import TasksServices from "../../services/tasksServices";
import { FcBriefcase } from "react-icons/fc";
import Task from "./Task";

const Tasks = () => {
  const [show, setShow] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [addProject, setAddProject] = useState(false);
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState({ title: "Timeline", _id: 0 });

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

  const getProjects = async () => {
    try {
      const res = await TasksServices.getProjects();
      setProjects(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <div className="main-content h-full">
      <div className="flex gap-2 overflow-y-auto h-full bg-white rounded-lg">
        <div className="w-1/4 p-3 border-r">
          <p className="font-bold text-lg mb-2">Quản lý công việc</p>

          <div className="p-3">
            <div
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded-md"
              onClick={() => {
                setCurrentProject({ title: "Công việc của tôi", _id: 0 });
              }}
            >
              <CiGrid41 className="w-7 h-7" />
              <p className="font-bold"> Timeline</p>
            </div>
            <div className="mt-3">
              <p className="font-bold text-lg mb-2">Tất cả dự án</p>
              <div className=" min-h-[450px] overflow-auto">
                {projects?.length > 0 ? (
                  projects.map((p) => {
                    return (
                      <div
                        className="flex gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded-md mt-2"
                        key={p?._id}
                        onClick={() => {
                          setCurrentProject(p);
                        }}
                      >
                        <FcBriefcase className="w-7 h-7" />
                        <p className="font-bold"> {p?.title}</p>
                      </div>
                    );
                  })
                ) : (
                  <Empty />
                )}
              </div>
              <p
                className="text-blue-500 hover:text-orange-500 text-center cursor-pointer"
                onClick={() => {
                  setAddProject(!addProject);
                }}
              >
                + Tạo dự án
              </p>
            </div>
          </div>
        </div>
        <Task currentProject={currentProject} />
      </div>
      <EditProject id={0} show={addProject} setShow={setAddProject} />
    </div>
  );
};

export default Tasks;
