import React, { useState } from "react";
import { Text } from "../../components/input";
import { Link, useNavigate } from "react-router-dom";
import Auth from "../../services/authServices";
import { LOCAL_STORAGE_USER_KEY } from "../../constant";
import Toast from "../../components/noti";

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const res = await Auth.login(data);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, res.data.token);
      navigate("/");
      Toast("success", res.data.message);
    } catch (error) {
      Toast("error", error.response.data.message);
    }
  };
  return (
    <div className="h-screen w-screen flex">
      <div className="w-1/3 px-24 py-8">
        <p className="font-bold text-5xl text-green-500">gapo</p>
        <p className="font-bold text-4xl mt-9">Xin chào Gapoer!</p>

        <Text
          title={"Email"}
          classname="w-96 mt-6 font-bold"
          type="login"
          value={data?.email}
          onChange={(e) => {
            setData({ ...data, email: e.target.value });
          }}
        />
        <Text
          title={"Mật khẩu"}
          classname="w-96 mt-6 font-bold"
          type="login"
          isPassword
          value={data?.password}
          onChange={(e) => {
            setData({ ...data, password: e.target.value });
          }}
        />
        <button className="btn-green w-96 mt-6 !py-4" onClick={onLogin}>
          Đăng nhập
        </button>
        <div className=" mt-4 text-right w-96">
          <Link className="text-blue-500 cursor-pointer font-bold" to="/register">
            Đăng ký
          </Link>
        </div>
      </div>
      <div className="w-2/3">
        <img src="https://www.gapo.vn/assets/images/right-cover.jpg" className="w-full h-full" />
      </div>
    </div>
  );
};

export default Login;
