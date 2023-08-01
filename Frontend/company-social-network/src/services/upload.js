/*
 * @description
 * @since         Saturday, 7 22nd 2023, 23:31:44 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */

import axiosClient from "../helper/Http";

const Upload = {
  uploadImage: (body) => {
    const url = "/files/upload";
    return axiosClient.post(url, body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
export default Upload;
