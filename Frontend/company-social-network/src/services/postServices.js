/*
 * @description
 * @since         Sunday, 7 23rd 2023, 22:15:00 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */

import axiosClient from "../helper/Http";

const PostServices = {
  uploadPost: (body) => {
    const url = "/story/posts";
    return axiosClient.post(url, body);
  },
  getPosts: (params) => {
    const url = "/story/posts";
    return axiosClient.get(url, { params });
  },
  likePost: (id) => {
    const url = "/story/like/" + id;
    return axiosClient.put(url);
  },
};

export default PostServices;
