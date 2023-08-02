/*
 * @description
 * @since         Wednesday, 8 2nd 2023, 21:41:35 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */

import axiosClient from "../helper/Http";

const Tasks = {
  getProject: (id) => {
    const url = "/job/projects/" + id;
    return axiosClient.get(url);
  },
  getProjects: () => {
    const url = "/job/projects";
    return axiosClient.get(url);
  },
  addProject: (body) => {
    const url = "/job/projects";
    return axiosClient.post(url, body);
  },
  updateProject: (id, body) => {
    const url = "/job/projects" + id;
    return axiosClient.put(url, body);
  },
  //   addDept: (body) => {
  //     const url = "/company/depts";
  //     return axiosClient.post(url, body);
  //   },
  //   getPosition: (id) => {
  //     const url = "/company/positions/" + id;
  //     return axiosClient.get(url);
  //   },
  //   getPositions: () => {
  //     const url = "/company/positions";
  //     return axiosClient.get(url);
  //   },
  //   updatePosition: (id, body) => {
  //     const url = "/company/positions/" + id;
  //     return axiosClient.put(url, body);
  //   },
  //   addPosition: (body) => {
  //     const url = "/company/positions";
  //     return axiosClient.post(url, body);
  //   },
};

export default Tasks;
