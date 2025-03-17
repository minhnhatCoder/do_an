import React, { useState } from "react";
import { Text } from "../../components/input";
import { Link, useNavigate } from "react-router-dom";
import Auth from "../../services/authServices";
import { LOCAL_STORAGE_USER_KEY } from "../../constant";
import Toast from "../../components/noti";

const Login = ({ setToken }) => {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const res = await Auth.login(data);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, res.data.token);
      setToken(res.data.token);
      navigate("/");
      Toast("success", res.data.message);
    } catch (error) {
      console.log(error);
      Toast("error", error.response?.data.message);
    }
  };
  return (
    <div className="h-screen w-screen flex">
      <div className="2xl:w-1/4">
        <img
          src="https://lambanner.com/wp-content/uploads/2021/04/MNT-DESIGN-KICH-THUOC-ANH-MANG-XA-HOI-2021.jpg"
          className="w-full h-screen object-cover"
        />
      </div>
      <div className="2xl:w-3/4 px-60 py-10">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <p className="text-primary-blue500 cursor-pointer">Về Unihome</p>
            <p className="text-primary-blue500 cursor-pointer">
              Quy định dịch vụ
            </p>
          </div>

          <div className="p-2 rounded-md flex items-center justify-center bg-primary-blue500 text-white cursor-pointer">
            VI
          </div>
        </div>

        <p className="font-bold text-3xl mt-20">Đăng nhập</p>

        <Text
          title={"Email"}
          classname="w-full mt-6 font-bold"
          type="login"
          placeholder="Email"
          value={data?.email}
          onChange={(e) => {
            setData({ ...data, email: e.target.value });
          }}
        />
        <Text
          title={"Mật khẩu"}
          classname="w-full mt-6 font-bold"
          type="login"
          placeholder="Mật khẩu"
          isPassword
          value={data?.password}
          onChange={(e) => {
            setData({ ...data, password: e.target.value });
          }}
        />
        <p className="pt-8 text-primary-blue500 font-bold cursor-pointer">
          Quên mật khẩu
        </p>
        <button className="btn-blue w-full mt-6 !py-4" onClick={onLogin}>
          Đăng nhập
        </button>

        <p className="text-center mt-24">
          @ 2025 Getfly CRM JSC. All rights reserved.
        </p>
        <p className="text-center">
          {" "}
          Hệ thống hoạt động tốt nhất trên trình duyệt Firefox và Chrome
        </p>
      </div>
    </div>
  );
};

export default Login;
