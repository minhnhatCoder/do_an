/*
 * @description
 * @since         Wednesday, 7 26th 2023, 21:39:54 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */
import { Modal, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { Date, Select, Text } from "../../components/input";
import UploadImage from "../../components/uploadImage";
import SelectDepartment from "../../components/Select/department";
import SelectPosition from "../../components/Select/Position";
import SelectGender from "../../components/Select/Gender";
import UserServices from "../../services/user";
import Toast from "../../components/noti";
import _ from "lodash";
import SelectStatus from "../../components/Select/Status";

const Edit = ({ show, setShow, id, setId, getData }) => {
  const [loading, setLoading] = useState(false);
  const [infoEdit, setInfoEdit] = useState({});
  const [image, setImage] = useState([]);

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
        const res = await UserServices.updateUser(id, body);
        getData();
        setId(0);
        setShow(false);
        setInfoEdit({});
        setImage([]);
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
        setImage([]);
        setShow(false);
        setLoading(false);
        Toast("success", res?.message);
      }
    } catch (error) {
      Toast("error", error.response?.data?.message);
      setLoading(false);
    }
  };
  const getUser = async () => {
    setLoading(true);
    const { data } = await UserServices.getUser(id);
    setImage([
      {
        name: "hinh-anh-doremon-cute-ngau-dep-nhat-2-1.jpg",
        public_id: "files/hinh-anh-doremon-cute-ngau-dep-nhat-2-1.jpg",
        uid: "__AUTO__1694614226192_0__",
        url: data?.image,
      },
    ]);
    setInfoEdit({
      display_name: data?.display_name,
      email: data?.email,
      phone: data?.phone,
      gender: data?.gender,
      birth: data?.birth,
      position: data?.position?._id,
      department: data?.department?._id,
      address: data?.address,
      status: data?.status,
    });
    setLoading(false);
  };
  useEffect(() => {
    id && show && getUser();
  }, [show]);
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
      onCancel={() => {
        setInfoEdit({});
        setImage([]);
        setId(0);
        setShow(false);
      }}
      width={700}
    >
      <Spin spinning={loading}>
        <div className="p-3  min-h-[700px] max-h-[1000px] overflow-y-auto h-[350px]">
          <div className="flex justify-center">
            <div className="flex flex-col items-center justify-center">
              <p className="mb-2">Ảnh đại diện</p>
              <UploadImage files={image} setFiles={setImage} type="avatar" isShowFile={false} />
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

          <div className="mt-5 flex items-center justify-center gap-2">
            <Text
              classname="w-1/2"
              title="Số điện thoại"
              value={infoEdit?.phone}
              required
              onChange={(e) => setInfoEdit({ ...infoEdit, phone: e.target.value })}
            />
            <SelectStatus
              menuPlacement={"top"}
              title="Trạng thái làm việc"
              className="w-1/2"
              value={infoEdit?.status}
              onChange={(e) => setInfoEdit({ ...infoEdit, status: e?.value })}
            />
          </div>

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
