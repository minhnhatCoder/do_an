import { Button, Input, Tabs, Space, Table, Tag, Empty } from "antd";
import React, { useEffect, useState } from "react";
import { BiSearchAlt, BiSort, BiTask, BiTaskX } from "react-icons/bi";
import { MdPendingActions } from "react-icons/md";
import { LuClipboardList, LuSlidersHorizontal } from "react-icons/lu";
import { AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
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
  const [currentProject, setCurrentProject] = useState({
    title: "Timeline",
    _id: 0,
  });
  const [idP, setIdP] = useState(0);

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
    <div className="h-full">
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
              <div className=" min-h-[452px] overflow-auto">
                {projects?.length > 0 ? (
                  projects.map((p) => {
                    return (
                      <div className="flex items-center gap-2" key={p?._id}>
                        <div
                          className="flex gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded-md mt-2 w-[95%]"
                          onClick={() => {
                            setCurrentProject(p);
                          }}
                        >
                          <FcBriefcase className="w-7 h-7" />
                          <p className="font-bold"> {p?.title}</p>
                        </div>
                        <AiOutlineEdit
                          className="w-5 h-5 cursor-pointer hover:text-orange-500"
                          onClick={() => {
                            setAddProject(true);
                            setIdP(p?._id);
                          }}
                        />
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
      <EditProject
        id={idP}
        setId={setIdP}
        show={addProject}
        setShow={setAddProject}
        getProjects={getProjects}
      />
    </div>
  );
};

export default Tasks;
