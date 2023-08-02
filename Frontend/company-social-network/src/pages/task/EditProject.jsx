/*
 * @description
 * @since         Wednesday, 8 2nd 2023, 21:54:48 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */

import { Modal, Spin } from "antd";
import React, { useState } from "react";
import { Text } from "../../components/input";
import SelectUsers from "../../components/Select/Users";
import Toast from "../../components/noti";
import Tasks from "../../services/tasksServices";

const Edit = ({ id, show, setShow }) => {
  const [infoEdit, setInfoEdit] = useState({});
  const [loading, setLoading] = useState(false);

  const onUpdate = async () => {
    setLoading(true);
    try {
      let res;
      if (id) {
        res = await Tasks.updateProject(id, infoEdit);
      } else {
        res = await Tasks.addProject(infoEdit);
        setInfoEdit({});
        setShow(false);
        setLoading(false);
        Toast("success", res?.message);
      }
    } catch (error) {
      setLoading(false);
      Toast("error", error?.response?.data?.message);
    }
  };
  return (
    <Modal
      title={
        <div className="flex items-center justify-center gap-2 border-b pb-2 border-gray-300">
          <p className="font-bold text-lg text-center">{id ? "Sửa dự án" : "Tạo dự án"}</p>
        </div>
      }
      open={show}
      //   footer={null}
      centered
      onOk={onUpdate}
      onCancel={() => {
        setShow(false);
        setInfoEdit({});
      }}
      width={900}
    >
      <Spin spinning={loading}>
        <div className="p-3  min-h-[700px] max-h-[1000px] overflow-y-auto h-[350px]">
          <Text
            classname="w-full"
            title="Tên dự án"
            value={infoEdit?.title}
            required
            onChange={(e) => setInfoEdit({ title: e, ...infoEdit })}
          />

          <div className="mt-5 w-full">
            <SelectUsers
              isMulti
              isClearable
              menuPlacement={"top"}
              title="Người liên quan"
              value={infoEdit?.related_user ?? []}
              onChange={(e) => setInfoEdit({ related_user: e?.map((item) => item?.value), ...infoEdit })}
            />
          </div>
        </div>
      </Spin>
    </Modal>
  );
};

export default Edit;