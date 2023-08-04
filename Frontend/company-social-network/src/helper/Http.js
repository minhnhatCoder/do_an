import axios from "axios";
import queryString from "query-string";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import { LOCAL_STORAGE_USER_KEY } from "../constant";
// import Toast from "../components/Toast";
const axiosClient = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(
  async (config) => {
    let authToken = localStorage.getItem(LOCAL_STORAGE_USER_KEY) || null;
    authToken = authToken ? authToken.trim() : null; // Loại bỏ các khoảng trắng không mong muốn
    config.headers.Authorization = authToken ? authToken : null;
    return config;
  },
  (err) => {
    return err;
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }

    return response;
  },
  (error) => {
    throw error;
  }
);

export default axiosClient;
