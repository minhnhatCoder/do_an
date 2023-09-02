/*
 * @description
 * @since         Saturday, 7 22nd 2023, 20:13:39 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */

import axiosClient from "../helper/Http";

const User = {
  getUser: (id) => {
    const url = "/social/users/" + id;
    return axiosClient.get(url);
  },
  getUsers: (params) => {
    const url = "/social/users";
    return axiosClient.get(url, { params: params });
  },
  postUser: (body) => {
    const url = "/auth/register ";
    return axiosClient.post(url, body);
  },
  updateUser: (id, body) => {
    const url = "/social/users/" + id;
    return axiosClient.put(url, body);
  },
  sendFriendRequest: (body) => {
    const url = "/friend_requests";
    return axiosClient.post(url, body);
  },
  approveFriendRequest: (id, body) => {
    const url = "/friend_requests/" + id;
    return axiosClient.put(url, body);
  },
  deleteFriendRequest: (id) => {
    const url = "/friend_requests/" + id;
    return axiosClient.delete(url);
  },
};

export default User;
