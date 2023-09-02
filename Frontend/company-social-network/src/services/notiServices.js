/*
 * @description
 * @since         Saturday, 9 2nd 2023, 17:24:19 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */
/*
 * @description
 * @since         Saturday, 7 22nd 2023, 20:13:39 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */

import axiosClient from "../helper/Http";

const Notification = {
  getNoti: (id) => {
    const url = "/notifications/" + id;
    return axiosClient.get(url);
  },
  getNotis: (params) => {
    const url = "/notifications";
    return axiosClient.get(url, { params: params });
  },
  readNoti: (id) => {
    const url = "/notifications/" + id + "/read";
    return axiosClient.put(url);
  },
  readAllNoti: () => {
    const url = "/notifications/read_all";
    return axiosClient.put(url);
  },
};

export default Notification;
