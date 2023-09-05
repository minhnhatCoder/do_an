import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import RootRoute from "./route";
import UserServices from "./services/user";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { LOCAL_STORAGE_USER_KEY } from "./constant";
import { useRootState } from "./store";
import DepartmentServices from "./services/deptServices";
import { io } from "socket.io-client";
import useSocketStore from "./store/socketStore";

function App() {
  const [token, setToken] = useState(localStorage.getItem(LOCAL_STORAGE_USER_KEY) || null);
  const setUserInfo = useRootState((state) => state.setUserInfo);
  const userInfo = useRootState((state) => state.userInfo);
  const setUsers = useRootState((state) => state.setUsers);
  const setDepts = useRootState((state) => state.setDepts);
  const setPositions = useRootState((state) => state.setPositions);
  const setUsersOnline = useRootState((state) => state.setUsersOnline);
  const setSocket = useSocketStore((state) => state.setSocket);
  const socket = useSocketStore((state) => state.socket);

  const getUserInfo = async () => {
    const token_gen = jwt_decode(token);
    const data = await UserServices.getUser(token_gen?._id);
    setUserInfo(data.data);
  };
  const getUsers = async () => {
    try {
      const res = await UserServices.getUsers();
      setUsers(res?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getDepts = async () => {
    try {
      const res = await DepartmentServices.getDepts();
      setDepts(res?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getPositions = async () => {
    try {
      const res = await DepartmentServices.getPositions();
      setPositions(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      getUserInfo();
      getDepts();
      getUsers();
      getPositions();
      setSocket(io("http://localhost:5000"));
    }
    return () => {
      // User leaves room
      socket.disconnect();
      socket.off();
    };
  }, [token]);

  useEffect(() => {
    if (socket) {
      const token_gen = jwt_decode(token);
      socket?.emit("addUser", token_gen?._id);
      socket?.on("getUsers", (users) => {
        setUsersOnline(userInfo.friends.filter((f) => users.some((u) => u.userId == f?._id)));
      });
    }
  }, [socket]);
  return (
    <div>
      <RootRoute {...{ setToken, token }} />
      <ToastContainer />
    </div>
  );
}

export default App;
