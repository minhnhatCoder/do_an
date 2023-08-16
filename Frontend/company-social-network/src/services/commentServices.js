/*
 * @description
 * @since         Thursday, 8 10th 2023, 21:21:15 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */

import axiosClient from "../helper/Http";

const CommentServices = {
  getComments: (params) => {
    const url = "/comments";
    return axiosClient.get(url, { params });
  },
};

export default CommentServices;
