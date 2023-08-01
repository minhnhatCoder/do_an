
import axiosClient from "../helper/Http";
import axios from "axios";
const Auth = {
  login: (body) => {
    const url = "http://localhost:5000/auth/login";
    return axios.post(url, body);
  },
  logout: () => {
    const url = "http://localhost:5000/auth/logout";
    return axiosClient.post(url);
  },

};

export default Auth;
