import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import RootRoute from "./route";
import UserServices from "./services/user";
import { useEffect } from "react";
import jwt_decode from "jwt-decode";
import { LOCAL_STORAGE_USER_KEY } from "./constant";
import { useRootState } from "./store";
import DepartmentServices from "./services/deptServices";

function App() {
  const token = localStorage.getItem(LOCAL_STORAGE_USER_KEY) || null;
  const setUserInfo = useRootState((state) => state.setUserInfo);
  const setUsers = useRootState((state) => state.setUsers);
  const setDepts = useRootState((state) => state.setDepts);
  const setPositions = useRootState((state) => state.setPositions);

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
    }
  }, [token]);
  return (
    <div>
      <RootRoute />
      <ToastContainer />
    </div>
  );
}

export default App;
