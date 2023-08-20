import { Avatar, Dropdown, Empty, Input, InputNumber, Table } from "antd";
import React, { useEffect, useState } from "react";
import { AiOutlineCheck, AiOutlineClose, AiOutlineMessage, AiOutlinePlus } from "react-icons/ai";
import { BiSearchAlt, BiSolidRightArrow, BiSolidDownArrow } from "react-icons/bi";
import { FcFolder, FcOpenedFolder } from "react-icons/fc";
import { FiFolderPlus, FiMoreHorizontal } from "react-icons/fi";
import { RxAvatar } from "react-icons/rx";
import DepartmentServices from "../../services/deptServices";
import UserServices from "../../services/user";
import _ from "lodash";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/button";
import Edit from "./Edit";
import { Text } from "../../components/input";
import Toast from "../../components/noti";
import { useRootState } from "../../store";
import ConversationsServices from "../../services/conversationServies";

const Friends = () => {
  const [depts, setDepts] = useState([]);
  const navigate = useNavigate();
  const setStoreDepts = useRootState((state) => state.setDepts);
  const userInfo = useRootState((state) => state.userInfo);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ depts_name: "", dept_id: 0, display_name: "", position_id: 0 });
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [show, setShow] = useState(false);
  const onMessage = async (params) => {
    try {
      const res = await ConversationsServices.getConversations(params);
      if (res?.data?.length > 0) {
        navigate("/chat/" + res?.data?.[0]?._id);
      } else {
        const newConversation = await ConversationsServices.postConversation({
          participants: params["participants[all]"],
        });
        navigate("/chat/" + newConversation?.data?._id);
      }
    } catch (error) {
      console.log(error?.message);
    }
  };

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
      width: 200,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Avatar src={value?.image} size="large" />
          <p className="font-semibold">{value?.display_name}</p>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 200,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      width: 150,
    },
    {
      title: "Vị trí công việc",
      dataIndex: "position",
      width: 150,
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
      render: (value, { key }) => {
        const items = [
          {
            key: "1",
            label: (
              <p
                className="font-semibold"
                onClick={() => {
                  onMessage({
                    "participants[all]": [userInfo?._id, key],
                    "type:eq": "personal",
                  });
                }}
              >
                Nhắn tin
              </p>
            ),
            icon: <AiOutlineMessage className="w-5 h-5" />,
          },
          {
            key: "2",
            label: (
              <Link to={value?.link} className="font-semibold">
                Xem trang cá nhân
              </Link>
            ),
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
              <FiMoreHorizontal className="w-6 h-6 cursor-pointer" color="#28526e" />
            </Dropdown>
          </div>
        );
      },
    },
  ];
  const [tableTitle, setTableTitle] = useState("Getfly");
  const getDepts = async () => {
    setLoading(true);
    try {
      const res = await DepartmentServices.getDepts();
      setDepts(res?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const getUsers = async (_page) => {
    setLoading(true);
    try {
      const params = {
        limit: 10,
        page: _page || _page == 0 ? _page : page,
        search: filter.display_name,
        ["department[eq]"]: filter.dept_id,
        ["position[eq]"]: filter.position_id,
      };

      const newParams = _.pickBy(params, _.identity);

      const res = await UserServices.getUsers(newParams);
      setUsers(
        res?.data?.map((user) => ({
          key: user?._id,
          members: {
            image: user?.image,
            display_name: user?.display_name,
          },
          link: `/profile/${user?.employee_id}`,
          email: user?.email,
          phone: user?.phone,
          position: {
            dept: user?.department?.name,
            role: user?.position?.name,
          },
          status: "Đang làm việc",
        }))
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const onAddDept = async (body) => {
    try {
      const res = await DepartmentServices.addDept(body);
      getDepts();
      Toast("success", res?.message);
    } catch (error) {
      Toast("error", error.response?.data?.message);
    }
  };
  useEffect(() => {
    getUsers();
  }, [filter?.dept_id, filter?.position_id]);
  useEffect(() => {
    getDepts();
  }, []);
  return (
    <div className="main-content h-full">
      <div className="flex gap-2 overflow-y-auto h-full bg-white rounded-lg">
        <div className="w-1/4 p-3 border-r">
          <p
            className={`font-bold text-lg mb-2 hover:text-orange-500 cursor-pointer ${
              tableTitle === "Getfly" && "text-orange-500"
            }`}
            onClick={() => {
              setFilter({ ...filter, dept_id: 0, position_id: 0 });
              setTableTitle("Getfly");
            }}
          >
            Công ty Getfly
          </p>

          <Input
            placeholder="Tìm kiếm..."
            prefix={<BiSearchAlt />}
            value={filter?.depts_name}
            onChange={(e) => setFilter({ ...filter, depts_name: e.target.value })}
          />

          <div>
            {depts?.filter(
              (d) =>
                d?.name.toLowerCase().includes(filter.depts_name.toLowerCase()) ||
                d?.positions?.some((p) => p?.name.toLowerCase().includes(filter.depts_name.toLowerCase()))
            )?.length > 0 ? (
              depts
                ?.filter(
                  (d) =>
                    d?.name.toLowerCase().includes(filter.depts_name.toLowerCase()) ||
                    d?.positions?.some((p) => p?.name.toLowerCase().includes(filter.depts_name.toLowerCase()))
                )
                ?.map((item) => {
                  return (
                    <DeptFolder
                      data={item}
                      key={item?._id}
                      setFilter={setFilter}
                      filter={filter}
                      setTableTitle={setTableTitle}
                      tableTitle={tableTitle}
                      getDepts={getDepts}
                    />
                  );
                })
            ) : (
              <Empty />
            )}
            <AddFolder onSuccess={onAddDept} />
          </div>
        </div>
        <div className="w-3/4 p-3">
          <div className="flex items-center justify-between">
            <p className="font-bold text-xl">{tableTitle}</p>
            <div className="flex items-center justify-center gap-2">
              <Input
                placeholder="Tìm kiếm..."
                prefix={<BiSearchAlt />}
                value={filter?.display_name}
                onChange={(e) => setFilter({ ...filter, display_name: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    getUsers(1);
                  }
                }}
              />
              <Button
                className={"btn-blue"}
                icon={<AiOutlinePlus className="w-5 h-5" />}
                onClick={() => {
                  setShow(true);
                }}
              >
                Tạo nhân viên
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <Table
              columns={columns}
              dataSource={users}
              pagination={false}
              scroll={{
                y: 500,
              }}
            />
          </div>
        </div>
      </div>
      <Edit show={show} setShow={setShow} id={0} setId={() => {}} getData={getUsers} />
    </div>
  );
};

export default Friends;

const DeptFolder = ({ data, setFilter, filter, setTableTitle, tableTitle, getDepts }) => {
  const [show, setShow] = useState(false);
  const onAddPos = async (body) => {
    try {
      const res = await DepartmentServices.addPosition({ department: data?._id, ...body });
      getDepts();
      Toast("success", res?.message);
    } catch (error) {
      Toast("error", error.response?.data?.message);
    }
  };
  return (
    <div>
      <div className="flex items-center gap-1 mb-2">
        {data?.positions?.length > 0 ? (
          show ? (
            <BiSolidDownArrow className="w-3 h-3 text-red-500" />
          ) : (
            <BiSolidRightArrow className="w-3 h-3 " />
          )
        ) : (
          <div className="w-3" />
        )}
        {show ? (
          <FcOpenedFolder
            className="w-8 h-8 cursor-pointer"
            onClick={() => {
              data?.positions?.length > 0 && setShow(false);
            }}
          />
        ) : (
          <FcFolder
            className="w-8 h-8 cursor-pointer"
            onClick={() => {
              data?.positions?.length > 0 && setShow(true);
            }}
          />
        )}

        <p
          className={`font-bold hover:text-orange-500 cursor-pointer ${tableTitle === data?.name && "text-orange-500"}`}
          onClick={() => {
            setFilter({ ...filter, dept_id: data?._id, position_id: 0 });
            setTableTitle(data?.name);
          }}
        >
          {data?.name}
        </p>
      </div>
      <div className="flex-col ml-10">
        {show &&
          data?.positions?.map((pos) => {
            return (
              <div key={pos?._id} className="flex items-center gap-2 mb-2">
                <FcFolder className="w-6 h-6" />
                <p
                  className={`font-medium text-xs hover:text-orange-500 cursor-pointer ${
                    tableTitle === pos?.name && "text-orange-500"
                  }`}
                  onClick={() => {
                    setFilter({ ...filter, position_id: pos?._id, dept_id: 0 });
                    setTableTitle(pos?.name);
                  }}
                >
                  {pos?.name}
                </p>
              </div>
            );
          })}
        {show && <AddFolder onSuccess={onAddPos} type="pos" />}
      </div>
    </div>
  );
};

const AddFolder = ({ onSuccess, type }) => {
  const [value, setValue] = useState("");
  const [level, setLevel] = useState(1);
  const [numberUser, setNumberUser] = useState(1);
  const [show, setShow] = useState(false);
  return (
    <div className={`flex items-center gap-2 ${type == "pos" ? "" : "ml-5"}`}>
      <FiFolderPlus
        className={`${type == "pos" ? "w-6 h-6" : "w-7 h-7"}  cursor-pointer  text-yellow-500`}
        onClick={() => setShow(!show)}
      />
      {show && (
        <div className="flex items-center gap-2">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={` ${type == "pos" ? "w-24" : "w-48"}`}
          />
          {type == "pos" && <InputNumber value={level} onChange={(e) => setLevel(e)} className={`w-12`} />}
          {type == "pos" && <InputNumber value={numberUser} onChange={(e) => setNumberUser(e)} className={`w-12`} />}
          <AiOutlineCheck
            className="w-5 h-5 cursor-pointer text-green-500"
            onClick={() => {
              if (type == "pos") {
                onSuccess({ name: value, level, number_user: numberUser });
              } else {
                onSuccess({ name: value });
              }
              setValue("");
              setLevel(1);
              setNumberUser(1);
              setShow(false);
            }}
          />
          <AiOutlineClose
            className="w-5 h-5 cursor-pointer text-red-500"
            onClick={() => {
              setValue("");
              setLevel(1);
              setNumberUser(1);
              setShow(false);
            }}
          />
        </div>
      )}
    </div>
  );
};
