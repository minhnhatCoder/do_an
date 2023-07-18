import React from "react";
import { Text } from "../../components/input";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="h-screen w-screen flex">
      <div className="w-1/3 px-24 py-8">
        <p className="font-bold text-5xl text-green-500">gapo</p>
        <p className="font-bold text-4xl mt-9">Đăng ký Gapoer!</p>

        <Text title={"Email"} classname="w-96 mt-6 font-bold" type="login" />
        <Text
          title={"Mật khẩu"}
          classname="w-96 mt-6 font-bold"
          type="login"
          isPassword
        />
        <Text
          title={"Mật khẩu"}
          classname="w-96 mt-6 font-bold"
          type="login"
          isPassword
        />
        <button className="btn-green w-96 mt-6 !py-4">Đăng ký</button>
        <div className=" mt-4 text-right w-96">
          <Link className="text-blue-500 cursor-pointer font-bold" to="/login">
            Đăng nhập
          </Link>
        </div>
      </div>
      <div className="w-2/3">
        <img
          src="https://www.gapo.vn/assets/images/right-cover.jpg"
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default Register;
