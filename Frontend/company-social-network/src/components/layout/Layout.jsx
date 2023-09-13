import React, { useEffect, useState } from "react";
import { AiFillHome, AiOutlineSetting } from "react-icons/ai";
import { IoIosPeople, IoMdNotificationsOutline } from "react-icons/io";
import { BsChatDots, BsCheckAll } from "react-icons/bs";
import { BiTask, BiSearchAlt } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import { FaRegUserCircle, FaUsers, FaUsersSlash } from "react-icons/fa";
import Toast from "../../components/noti";
import { Avatar, Badge, Dropdown, AutoComplete, Input, Popover, Empty, FloatButton } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useRootState } from "../../store";
import { LOCAL_STORAGE_USER_KEY } from "../../constant";
import UserServices from "../../services/user";
import NotificationServices from "../../services/notiServices";
import useSocketStore from "../../store/socketStore";
import { CommentOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import PopupChat from "./PopupChat";
import ConversationsServices from "../../services/conversationServies";
import usePopupChatStore from "../../store/popupChatStore";

const Layout = ({ children }) => {
  const socket = useSocketStore((state) => state?.socket);
  const navigate = useNavigate();
  const userInfo = useRootState((state) => state.userInfo);
  const addConversation = usePopupChatStore((state) => state?.addConversation);
  let location = useLocation();
  const [menuItems] = useState([
    { icon: <AiFillHome className="w-8 h-8" color="#28526e" />, link: "/" },
    {
      icon: <IoIosPeople className="w-8 h-8" color="#28526e" />,
      link: "/friends",
    },
    { icon: <BsChatDots className="w-8 h-8" color="#28526e" />, link: "/chat" },
    { icon: <BiTask className="w-8 h-8" color="#28526e" />, link: "/tasks" },
  ]);
  const [menuActive, setMenuActive] = useState("/");
  const items = [
    {
      key: "1",
      label: (
        <Link className="font-semibold" to={`/profile/${userInfo?.employee_id}`}>
          Xem trang cá nhân
        </Link>
      ),
      icon: <FaRegUserCircle className="w-5 h-5" />,
    },
    {
      key: "2",
      label: <a className="font-semibold">Cài đặt</a>,
      icon: <AiOutlineSetting className="w-5 h-5" />,
    },
    {
      key: "3",
      label: (
        <p
          className="font-semibold"
          onClick={() => {
            localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
            Toast("success", "Đăng xuất thành công");
            navigate("/login");
          }}
        >
          Đăng xuất
        </p>
      ),
      icon: <FiLogOut className="w-5 h-5" />,
    },
  ];
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState("");
  const onSearch = async (searchText) => {
    try {
      if (searchText.length < 3) return;
      const params = {
        limit: 9999,
        page: 1,
        search: searchText,
        "_id[ne]": userInfo?._id,
      };
      const res = await UserServices.getUsers(params);
      const friends = res?.data?.filter((u) => userInfo?.friends.find((i) => i?._id == u?._id));
      const stranger = res?.data?.filter((u) => (userInfo?.friends.find((i) => i?._id == u?._id) ? false : true));
      setOptions(
        !searchText
          ? []
          : [
              {
                label: renderTitle("Bạn bè", friends?.length),
                options: friends.map((item) =>
                  renderItem({
                    id: item._id,
                    display_name: item.display_name,
                    image: item.image,
                    position: {
                      dept: item?.department?.name,
                      role: item?.position?.name,
                    },
                  })
                ),
              },
              {
                label: renderTitle("Người lạ", stranger?.length),
                options: stranger.map((item) =>
                  renderItem({
                    id: item._id,
                    display_name: item.display_name,
                    image: item.image,
                    position: {
                      dept: item?.department?.name,
                      role: item?.position?.name,
                    },
                  })
                ),
              },
            ]
      );

      return;
    } catch (error) {
      Toast("error", error.message);
    }
  };

  const onSelect = () => {
    setSearch("");
  };

  const renderTitle = (title, count) => (
    <div className="flex items-center gap-2">
      {title == "Bạn bè" ? (
        <FaUsers className="w-5 h-5 text-neutral-500" />
      ) : (
        <FaUsersSlash className="w-5 h-5 text-neutral-500" />
      )}
      <p>
        {title} <span className="text-blue-500">({count})</span>
      </p>
    </div>
  );

  const renderItem = (item) => ({
    value: item.name,
    label: (
      <Link to={`/profile/${item.id}`}>
        <div className="flex items-center gap-2 cursor-pointer">
          <Avatar
            className="border border-black"
            size={40}
            src={item?.image || "https://xsgames.co/randomusers/avatar.php?g=pixel&key=1"}
          />
          <div>
            <p className="font-bold">{item?.display_name}</p>
            <p className="text-xs text-neutral-400">
              {item?.position?.role}-{item?.position?.dept}
            </p>
          </div>
        </div>
      </Link>
    ),
  });

  const onMessage = async (id, updatedMessage) => {
    try {
      const res = await ConversationsServices.getConversation(id);
      addConversation && addConversation({ ...res?.data, isPopup: true }, updatedMessage);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket &&
      socket?.on("getMessage", (mess) => {
        mess && onMessage(mess?.target, mess?.content);
      });
  }, [socket]);

  useEffect(() => {
    if (location?.pathname?.includes("/chat")) setMenuActive("/chat");
    else if (location?.pathname?.includes("/friends")) setMenuActive("/friends");
    else if (location?.pathname?.includes("/tasks")) setMenuActive("/tasks");
    else setMenuActive("/");
  }, [location?.pathname]);
  if (location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/forgot") {
    return <div>{children}</div>;
  } else
    return (
      <div className="min-h-full h-screen">
        <div className="p-2 flex items-center justify-between box_shadow-light px-16">
          <div className="flex items-center justify-center gap-9">
            <p className="font-bold text-2xl">DagoSocial</p>
            <AutoComplete
              options={options}
              className="w-72"
              onSearch={onSearch}
              dropdownMatchSelectWidth={450}
              allowClear
              defaultValue=""
              onClear={() => setOptions([])}
              onSelect={onSelect}
              // autoComplete
            >
              <Input
                size="large"
                placeholder="Tìm kiếm..."
                className="rounded-full"
                prefix={<BiSearchAlt className="w-6 h-6" />}
                value={search}
                onChange={(e) => setSearch(e)}
              />
            </AutoComplete>
          </div>

          <div className="flex items-center justify-center gap-2">
            {menuItems?.map((item, index) => {
              return (
                <Link to={item.link} key={index}>
                  <div
                    className={`flex items-center justify-center border-b-[3px] cursor-pointer ${
                      item?.link == menuActive ? "border-b-[#28526e]" : "border-b-white"
                    } hover:bg-gray-100 py-3 px-6 rounded-t-lg hover:border-b-[#28526e]`}
                    onClick={() => {
                      setMenuActive(item?.link);
                    }}
                  >
                    {item.icon}
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-4">
            <NotificationCO />

            <Dropdown
              menu={{
                items,
              }}
            >
              <div className="flex items-center justify-center gap-2 cursor-pointer">
                <Avatar className="border " size={40} src={userInfo?.image || ""} />
                <p className="font-bold">{userInfo?.display_name}</p>
              </div>
            </Dropdown>
          </div>
        </div>
        <div className="flex-1 max-h-[calc(100vh-75px)] h-[calc(100vh-75px)]">{children}</div>
        {menuActive != "/chat" && <PopupChat />}
      </div>
    );
};

export default Layout;

const NotificationCO = () => {
  const [notis, setNotis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const userInfo = useRootState((state) => state.userInfo);
  const [open, setOpen] = useState(false);
  const socket = useSocketStore((state) => state.socket);
  const getNotis = async () => {
    try {
      setLoading(true);
      const res = await NotificationServices.getNotis({
        page,
        "recipient[eq]": userInfo?._id,
        "is_read[eq]": "false",
        sort: "-created_at",
        limit: 10000,
      });
      // if (page == 1) {
      setNotis(res?.data);
      // } else {
      //   setNotis([...notis, ...res.data]);
      // }

      setHasMore([...notis, res?.data]?.length < res?.count);
      setCount(res?.count);
      setLoading(false);
    } catch (error) {
      console.log(error?.message);
      setLoading(false);
    }
  };
  const onReadNoti = async (id) => {
    try {
      setLoading(true);
      const res = await NotificationServices.readNoti(id);
      setNotis(
        notis.map((n) => {
          if (n?._id == id) {
            return { ...n, is_read: true };
          } else return n;
        })
      );
      setCount(count - 1);
      setLoading(false);
    } catch (error) {
      console.log(error?.message);
      setLoading(false);
    }
  };
  const onReadAllNoti = async (id) => {
    try {
      setLoading(true);
      const res = await NotificationServices.readAllNoti();
      setNotis([]);
      setCount(0);
      setLoading(false);
      Toast("success", res?.message);
    } catch (error) {
      console.log(error?.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (socket) {
      socket?.on("getNotification", (data) => {
        Toast("info", data?.content);
        getNotis();
      });
    }
  }, [socket]);

  const handleShowNotis = () => {
    return (
      <div className="w-96 min-h-[350px] max-h-[550px] overflow-auto flex flex-col relative">
        {notis?.length > 0 ? (
          notis?.map((noti) => {
            return (
              <div
                key={noti?._id}
                className="flex items-center justify-between p-3 hover:bg-neutral-100 cursor-pointer"
              >
                <p className={`${noti?.is_read ? "" : "font-bold"}`}>{noti?.content}</p>
                {noti?.is_read ? (
                  <BsCheckAll className="w-6 h-6 text-blue-500 cursor-pointer" />
                ) : (
                  <BsCheckAll
                    className="w-6 h-6 text-neutral-400 cursor-pointer hover:text-blue-500"
                    onClick={() => onReadNoti(noti?._id)}
                  />
                )}
              </div>
            );
          })
        ) : (
          <Empty />
        )}
      </div>
    );
  };

  useEffect(() => {
    getNotis();
  }, [page]);
  useEffect(() => {
    !open && setNotis(notis?.filter((noti) => !noti?.is_read));
  }, [open]);

  return (
    <Popover
      content={handleShowNotis()}
      title={
        <div className="flex items-center justify-between">
          <p className="font-bold text-base">Thông báo</p>
          <p className="text-blue-500 hover:text-orange-500 cursor-pointer text-xs" onClick={onReadAllNoti}>
            Đọc tất cả thông báo
          </p>
        </div>
      }
      trigger="click"
      placement="bottom"
      open={open}
    >
      <Badge count={count} overflowCount={99} offset={[0, 0]} onClick={() => setOpen(!open)}>
        <IoMdNotificationsOutline className="w-8 h-8 cursor-pointer" color="#28526e" />
      </Badge>
    </Popover>
  );
};
