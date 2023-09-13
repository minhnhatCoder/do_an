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
  updatePost: (id, body) => {
    const url = "/story/posts/" + id;
    return axiosClient.put(url, body);
  },
  deletePost: (id) => {
    const url = "/story/posts/" + id;
    return axiosClient.delete(url);
  },
  commentPost: (id, body) => {
    const url = "/story/comment/" + id;
    return axiosClient.put(url, body);
  },
  answerCommentPost: (id, body) => {
    const url = "/story/comment/" + id + "/answer";
    return axiosClient.put(url, body);
  },
  getPosts: (params) => {
    const url = "/story/posts";
    return axiosClient.get(url, { params });
  },
  getPost: (id) => {
    const url = "/story/posts/" + id;
    return axiosClient.get(url);
  },
  likePost: (id) => {
    const url = "/story/like/" + id;
    return axiosClient.put(url);
  },
};

export default PostServices;
