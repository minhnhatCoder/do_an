/*
 * @description
 * @since         Wednesday, 7 26th 2023, 21:39:54 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */
import { Modal, Spin } from "antd";
import React, { useState } from "react";
import { Date, Select, Text } from "../../components/input";
import UploadImage from "../../components/uploadImage";
import SelectDepartment from "../../components/Select/department";
import SelectPosition from "../../components/Select/Position";
import SelectGender from "../../components/Select/Gender";
import UserServices from "../../services/user";
import Toast from "../../components/noti";
import _ from "lodash";

const Edit = ({ show, setShow, id, setId, getData }) => {
  const [loading, setLoading] = useState(false);
  const [infoEdit, setInfoEdit] = useState({});
  const [image, setImage] = useState("");

  const onUpdate = async () => {
    if (infoEdit?.password !== infoEdit?.password_confirm) {
      return Toast("error", "Mật khẩu nhập lại không khớp");
    }
    setLoading(true);
    try {
      if (id) {
        const body = _.cloneDeep(infoEdit);
        delete body.password_confirm;
        body.image = image?.[0]?.url;
        const res = await UserServices.updateUser(body);
        getData();
        setId(0);
        setShow(false);
        setInfoEdit({});
        setImage("");
        setLoading(false);
        Toast("success", res?.message);
      } else {
        const body = _.cloneDeep(infoEdit);
        delete body.password_confirm;
        body.image = image?.[0]?.url;
        const res = await UserServices.postUser(body);
        getData();
        setId(0);
        setInfoEdit({});
        setImage("");
        setShow(false);
        setLoading(false);
        Toast("success", res?.message);
      }
    } catch (error) {
      Toast("error", error.response?.data?.message);
      setLoading(false);
    }
  };
  return (
    <Modal
      title={
        <div className="flex items-center justify-center gap-2 border-b pb-2 border-gray-300">
          <p className="font-bold text-lg text-center">{id ? "Sửa nhân viên" : "Tạo nhân viên"}</p>
        </div>
      }
      open={show}
      //   footer={null}
      centered
      onOk={onUpdate}
      onCancel={() => setShow(false)}
      width={700}
    >
      <Spin spinning={loading}>
        <div className="p-3  min-h-[700px] max-h-[1000px] overflow-y-auto h-[350px]">
          <div className="flex justify-center">
            <div className="flex flex-col items-center justify-center">
              <p className="mb-2">Ảnh đại diện</p>
              <UploadImage files={image} setFiles={setImage} type="avatar" />
            </div>
          </div>

          <Text
            classname="w-full"
            title="Tên nhân viên"
            value={infoEdit?.display_name}
            required
            onChange={(e) => {
              setInfoEdit({ ...infoEdit, display_name: e.target.value });
            }}
          />

          <Text
            classname="w-full mt-5"
            title="Email"
            value={infoEdit?.email}
            required
            onChange={(e) => setInfoEdit({ ...infoEdit, email: e.target.value })}
          />
          <div className="flex items-center justify-center gap-2">
            <Text
              classname="w-full mt-5"
              title="Mật khẩu"
              value={infoEdit?.password}
              required
              isPassword
              onChange={(e) => setInfoEdit({ ...infoEdit, password: e.target.value })}
            />
            <Text
              classname="w-full mt-5"
              title="Nhập lại mật khẩu"
              value={infoEdit?.password_confirm}
              required
              isPassword
              onChange={(e) => setInfoEdit({ ...infoEdit, password_confirm: e.target.value })}
            />
          </div>
          <div className="flex items-center justify-center gap-3 mt-5">
            <SelectDepartment
              menuPlacement={"bottom"}
              title="Phòng ban"
              required
              isClearable
              className="w-1/2"
              value={infoEdit?.department}
              onChange={(e) => {
                if (!e) {
                  setInfoEdit({ ...infoEdit, department: null, position: null });
                } else {
                  setInfoEdit({ ...infoEdit, department: e?.value });
                }
              }}
            />

            <SelectPosition
              menuPlacement={"bottom"}
              title="Vị trí"
              required
              isClearable
              disabled={!infoEdit?.department}
              className="w-1/2"
              deptId={infoEdit?.department}
              value={infoEdit?.position}
              onChange={(e) => {
                if (!e) {
                  setInfoEdit({ ...infoEdit, position: null });
                } else setInfoEdit({ ...infoEdit, position: e?.value });
              }}
            />
          </div>

          <Text
            classname="w-full mt-5"
            title="Số điện thoại"
            value={infoEdit?.phone}
            required
            onChange={(e) => setInfoEdit({ ...infoEdit, phone: e.target.value })}
          />
          <Text
            classname="w-full mt-5"
            title="Địa chỉ"
            value={infoEdit?.address}
            required
            onChange={(e) => setInfoEdit({ ...infoEdit, address: e.target.value })}
          />
          <div className="mt-5 flex items-center justify-center gap-2">
            <Date
              className="w-1/2"
              title="Ngày sinh"
              value={infoEdit?.birth}
              type="date"
              onChange={(e) => {
                setInfoEdit({ ...infoEdit, birth: e });
              }}
            />
            <SelectGender
              menuPlacement={"top"}
              title="Giới tính"
              className="w-1/2"
              value={infoEdit?.gender}
              onChange={(e) => setInfoEdit({ ...infoEdit, gender: e?.value })}
            />
          </div>
        </div>
      </Spin>
    </Modal>
  );
};

export default Edit;
