import React, { useState } from "react";
import { AiFillHome, AiOutlineSetting } from "react-icons/ai";
import { IoIosPeople, IoMdNotificationsOutline } from "react-icons/io";
import { BsChatDots } from "react-icons/bs";
import { BiTask, BiSearchAlt } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import { FaRegUserCircle } from "react-icons/fa";
import Toast from "../../components/noti";
import { Avatar, Badge, Dropdown, AutoComplete, Input } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useRootState } from "../../store";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const userInfo = useRootState((state) => state.userInfo);
  let location = useLocation();
  const [menuItems] = useState([
    { icon: <AiFillHome className="w-8 h-8" color="#28526e" />, link: "/" },
    {
      icon: <IoIosPeople className="w-8 h-8" color="#28526e" />,
      link: "/friends",
    },
    { icon: <BsChatDots className="w-8 h-8" color="#28526e" />, link: "/" },
    { icon: <BiTask className="w-8 h-8" color="#28526e" />, link: "/tasks" },
  ]);
  const [menuActive, setMenuActive] = useState(0);
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
        <Link className="font-semibold" to="/login">
          Đăng xuất
        </Link>
      ),
      icon: <FiLogOut className="w-5 h-5" />,
    },
  ];
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState("");
  const onSearch = async () => {
    try {
      // const {
      //   data: { data },
      // } = await Products.getProducts(params);
      await setOptions([]);
      return;
    } catch (error) {
      Toast("error", error.message);
    }
  };

  const renderTitle = (item) => ({
    value: item.name,
    label: (
      <Link to={`/user/${item.id}`}>
        <div className="flex items-center justify-center gap-2 cursor-pointer">
          <Avatar
            className="border border-black"
            size={40}
            src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1"
          />
          <p className="font-bold">Trần Minh Nhật</p>
        </div>
      </Link>
    ),
  });
  if (location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/forgot") {
    return <div>{children}</div>;
  } else
    return (
      <div className="min-h-full h-screen">
        <div className="p-2 flex items-center justify-between box_shadow-light">
          <div className="flex items-center justify-center gap-9">
            <img
              src="https://1000logos.net/wp-content/uploads/2021/10/Batman-Logo-500x281.png"
              className="h-12 w-auto bg-cover"
            />
            <AutoComplete
              options={options}
              className="w-72"
              onSearch={onSearch}
              dropdownMatchSelectWidth={500}
              allowClear
              defaultValue=""
              onClear={() => setOptions([])}
              // autoComplete
            >
              <Input size="large" placeholder="Tìm kiếm..." className="rounded-full" prefix={<BiSearchAlt />} />
            </AutoComplete>
          </div>

          <div className="flex items-center justify-center gap-2">
            {menuItems?.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`flex items-center justify-center border-b-[3px] cursor-pointer ${
                    index == menuActive ? "border-b-[#28526e]" : "border-b-white"
                  } hover:bg-gray-100 py-3 px-6 rounded-t-lg hover:border-b-[#28526e]`}
                  onClick={() => {
                    setMenuActive(index);
                  }}
                >
                  <Link to={item.link}>{item.icon}</Link>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-4">
            <Dropdown
              trigger={"click"}
              placement="bottom"
              menu={{
                items,
              }}
            >
              <Badge count={99} overflowCount={99} offset={[0, 0]}>
                <IoMdNotificationsOutline className="w-8 h-8 cursor-pointer" color="#28526e" />
              </Badge>
            </Dropdown>

            <Dropdown
              menu={{
                items,
              }}
            >
              <div className="flex items-center justify-center gap-2 cursor-pointer">
                <Avatar className="border border-black" size={40} src={userInfo?.image || ""} />
                <p className="font-bold">{userInfo?.display_name}</p>
              </div>
            </Dropdown>
          </div>
        </div>
        <div className="flex-1 max-h-[calc(100vh-75px)] h-[calc(100vh-75px)]">{children}</div>
      </div>
    );
};

export default Layout;
