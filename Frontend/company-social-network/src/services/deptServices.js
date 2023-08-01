/*
 * @description
 * @since         Tuesday, 7 25th 2023, 21:19:16 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */

import axiosClient from "../helper/Http";

const Department = {
  getDept: (id) => {
    const url = "/company/depts/" + id;
    return axiosClient.get(url);
  },
  getDepts: () => {
    const url = "/company/depts";
    return axiosClient.get(url);
  },
  updateDept: (id, body) => {
    const url = "/company/depts/" + id;
    return axiosClient.put(url, body);
  },
  addDept: (body) => {
    const url = "/company/depts";
    return axiosClient.post(url, body);
  },
  getPosition: (id) => {
    const url = "/company/positions/" + id;
    return axiosClient.get(url);
  },
  getPositions: () => {
    const url = "/company/positions";
    return axiosClient.get(url);
  },
  updatePosition: (id, body) => {
    const url = "/company/positions/" + id;
    return axiosClient.put(url, body);
  },
  addPosition: (body) => {
    const url = "/company/positions";
    return axiosClient.post(url, body);
  },
};

export default Department;
