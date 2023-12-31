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
    const url = "/job/projects/" + id;
    return axiosClient.put(url, body);
  },
  getTask: (id) => {
    const url = "/job/tasks/" + id;
    return axiosClient.get(url);
  },
  getTasks: (params) => {
    const url = "/job/tasks";
    return axiosClient.get(url, { params: params });
  },
  addTask: (body) => {
    const url = "/job/tasks";
    return axiosClient.post(url, body);
  },
  updateTask: (id, body) => {
    const url = "/job/tasks/" + id;
    return axiosClient.put(url, body);
  },
  commentTask: (id, body) => {
    const url = "/job/tasks/comment/" + id;
    return axiosClient.post(url, body);
  },
  deleteTask: (id) => {
    const url = "/job/tasks/" + id;
    return axiosClient.delete(url);
  },
  getStatistic: (params) => {
    const url = "/job/statistic";
    return axiosClient.get(url, { params: params });
  }
};

export default Tasks;
