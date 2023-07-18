import React, { useEffect, useState } from "react";
import {
  BsFillPersonFill,
  BsPencil,
  BsFillTelephoneFill,
  BsFillBriefcaseFill,
} from "react-icons/bs";
import { AiFillInfoCircle } from "react-icons/ai";
import _ from "lodash";
import { Text } from "../../components/input";
import { Input } from "antd";

const Info = () => {
  const [editInfo, setEditInfo] = useState([
    {
      isEdit: false,
      info: {
        display_name: "Lê Văn Bình",
        email: "Thanhbinh191099@gmail.com",
        birthday: "19/10/1999",
        address: "Hà Nội",
      },
    },
    {
      isEdit: false,
      info: {
        phone: "0983296832",
        link: "Thanhbinh191099@gmail.com",
      },
    },
    {
      isEdit: false,
      info: {
        company: "Getfly",
        staff_code: "NV191099",
        role_name: "Nhân viên",
        position: "Hunter Team",
      },
    },
  ]);
  const [initialInfo, setInitialInfo] = useState();
  useEffect(() => {
    setInitialInfo(_.cloneDeep(editInfo));
  }, []);
  return (
    <div className="w-2/3 mx-auto mt-3">
      <div className="bg-white rounded-lg p-3">
        <div className="px-2 pb-2 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center p-3 rounded-lg bg-blue-200">
              <BsFillPersonFill className="w-6 h-6 text-blue-600" />
            </div>
            <p className="font-bold text-lg">Thông tin cá nhân</p>
          </div>
          {!editInfo[0].isEdit ? (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                editInfo[0].isEdit = true;
                setEditInfo([...editInfo]);
              }}
            >
              <BsPencil className="w-5 h-5 text-blue-500" />
              <p className="text-blue-500">Chỉnh sửa</p>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                className="btn-gray !px-7"
                onClick={() => {
                  editInfo[0].isEdit = false;
                  editInfo[0].info = _.cloneDeep(initialInfo[0].info);
                  setEditInfo([...editInfo]);
                }}
              >
                Hủy
              </button>
              <button
                className="btn-green !px-7"
                onClick={() => {
                  editInfo[0].isEdit = false;
                  setEditInfo([...editInfo]);
                  setInitialInfo(_.cloneDeep(editInfo));
                }}
              >
                Lưu
              </button>
            </div>
          )}
        </div>
        <div className="mt-5">
          <div className="flex mt-3">
            <div className="w-1/5 text-neutral-500 text-lg font-medium">
              Tên hiển thị
            </div>
            <div className="w-4/5 ">
              {editInfo?.[0]?.isEdit ? (
                <Input
                  value={editInfo?.[0]?.info?.display_name}
                  onChange={(e) => {
                    editInfo[0].info.display_name = e?.target?.value;
                    setEditInfo([...editInfo]);
                  }}
                />
              ) : (
                <p className="font-bold">{editInfo?.[0]?.info?.display_name}</p>
              )}
            </div>
          </div>
          <div className="flex mt-3">
            <div className="w-1/5 text-neutral-500 text-lg font-medium">
              Email
            </div>
            <div className="w-4/5 ">
              {editInfo?.[0]?.isEdit ? (
                <Input value={editInfo?.[0]?.info?.email} disabled />
              ) : (
                <p className="font-bold text-green-500">
                  Thanhbinh191099@gmail.com
                </p>
              )}

              <p className="text-base text-neutral-500 mt-2">
                <AiFillInfoCircle className="text-green-500 float-left mt-1 mr-2 w-5 h-5" />
                Tài khoản đăng nhập không thể thay đổi
              </p>
            </div>
          </div>
          <div className="flex mt-3">
            <div className="w-1/5 text-neutral-500 text-lg font-medium">
              Ngày sinh
            </div>
            <div className="w-4/5">
              {editInfo?.[0]?.isEdit ? (
                <Input
                  value={editInfo?.[0]?.info?.birthday}
                  onChange={(e) => {
                    editInfo[0].info.birthday = e?.target?.value;
                    setEditInfo([...editInfo]);
                  }}
                />
              ) : (
                <p className="font-bold">{editInfo?.[0]?.info?.birthday}</p>
              )}
            </div>
          </div>
          <div className="flex mt-3">
            <div className="w-1/5 text-neutral-500 text-lg font-medium">
              Địa chỉ
            </div>
            <div className="w-4/5">
              {editInfo?.[0]?.isEdit ? (
                <Input
                  value={editInfo?.[0]?.info?.address}
                  onChange={(e) => {
                    editInfo[0].info.address = e?.target?.value;
                    setEditInfo([...editInfo]);
                  }}
                />
              ) : (
                <p className="font-bold">{editInfo?.[0]?.info?.address}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg p-3 mt-4">
        <div className="px-2 pb-2 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center p-3 rounded-lg bg-orange-200">
              <BsFillTelephoneFill className="w-6 h-6 text-orange-600" />
            </div>
            <p className="font-bold text-lg">Thông tin liên hệ</p>
          </div>
          {!editInfo[1].isEdit ? (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                editInfo[1].isEdit = true;
                setEditInfo([...editInfo]);
              }}
            >
              <BsPencil className="w-5 h-5 text-blue-500" />
              <p className="text-blue-500">Chỉnh sửa</p>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                class="btn-gray !px-7"
                onClick={() => {
                  editInfo[1].isEdit = false;
                  editInfo[1].info = _.cloneDeep(initialInfo[1].info);
                  setEditInfo([...editInfo]);
                }}
              >
                Hủy
              </button>
              <button
                class="btn-green !px-7"
                onClick={() => {
                  editInfo[1].isEdit = false;
                  setEditInfo([...editInfo]);
                  setInitialInfo(_.cloneDeep(editInfo));
                }}
              >
                Lưu
              </button>
            </div>
          )}
        </div>
        <div className="mt-5">
          <div className="flex mt-3">
            <div className="w-1/5 text-neutral-500 text-lg font-medium">
              Số điện thoại
            </div>
            <div className="w-4/5 ">
              {editInfo?.[1]?.isEdit ? (
                <Input
                  value={editInfo?.[1]?.info?.phone}
                  onChange={(e) => {
                    editInfo[1].info.phone = e?.target?.value;
                    setEditInfo([...editInfo]);
                  }}
                />
              ) : (
                <p className="font-bold">{editInfo?.[1]?.info?.phone}</p>
              )}
            </div>
          </div>
          <div className="flex mt-3">
            <div className="w-1/5 text-neutral-500 text-lg font-medium">
              Đường dẫn
            </div>
            <div className="w-4/5 ">
              {editInfo?.[1]?.isEdit ? (
                <Input
                  value={editInfo?.[1]?.info?.link}
                  onChange={(e) => {
                    editInfo[1].info.link = e?.target?.value;
                    setEditInfo([...editInfo]);
                  }}
                />
              ) : (
                <p className="font-bold  text-green-500">
                  {editInfo?.[1]?.info?.link}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-3 mt-4">
        <div className="px-2 pb-2 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center p-3 rounded-lg bg-blue-200">
              <BsFillBriefcaseFill className="w-6 h-6 text-green-600" />
            </div>
            <p className="font-bold text-lg">Công việc</p>
          </div>
          {!editInfo[2].isEdit ? (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                editInfo[2].isEdit = true;
                setEditInfo([...editInfo]);
              }}
            >
              <BsPencil className="w-5 h-5 text-blue-500" />
              <p className="text-blue-500">Chỉnh sửa</p>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                class="btn-gray !px-7"
                onClick={() => {
                  editInfo[2].isEdit = false;
                  editInfo[2].info = _.cloneDeep(initialInfo[2].info);
                  setEditInfo([...editInfo]);
                }}
              >
                Hủy
              </button>
              <button
                class="btn-green !px-7"
                onClick={() => {
                  editInfo[2].isEdit = false;
                  setEditInfo([...editInfo]);
                  setInitialInfo(_.cloneDeep(editInfo));
                }}
              >
                Lưu
              </button>
            </div>
          )}
        </div>
        <div className="mt-5">
          <div className="flex mt-3">
            <div className="w-1/5 text-neutral-500 text-lg font-medium">
              Tổ chức
            </div>
            <div className="w-4/5 ">
              {editInfo?.[2]?.isEdit ? (
                <Input value={editInfo?.[2]?.info?.company} disabled />
              ) : (
                <p className="font-bold">{editInfo?.[2]?.info?.company}</p>
              )}
            </div>
          </div>
          <div className="flex mt-3">
            <div className="w-1/5 text-neutral-500 text-lg font-medium">
              Mã nhân viên
            </div>
            <div className="w-4/5 ">
              {editInfo?.[2]?.isEdit ? (
                <Input
                  value={editInfo?.[2]?.info?.staff_code}
                  onChange={(e) => {
                    editInfo[2].info.staff_code = e?.target?.value;
                    setEditInfo([...editInfo]);
                  }}
                />
              ) : (
                <p className="font-bold text-green-500">
                  {editInfo?.[2]?.info?.staff_code}
                </p>
              )}
            </div>
          </div>
          <div className="flex mt-3">
            <div className="w-1/5 text-neutral-500 text-lg font-medium">
              Vị trí
            </div>
            <div className="w-4/5 font-bold">
              Hunter team - Nhân viên Hunter Team
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
