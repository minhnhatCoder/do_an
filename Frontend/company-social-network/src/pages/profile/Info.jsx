import React, { useEffect, useState } from "react";
import { BsFillPersonFill, BsPencil, BsFillTelephoneFill, BsFillBriefcaseFill } from "react-icons/bs";
import { AiFillInfoCircle } from "react-icons/ai";
import _ from "lodash";
import { Date, Text } from "../../components/input";
import { Input } from "antd";
import { convertTimeStampToString } from "../../helper/timeHelper";
import UserServices from "../../services/user";
import Toast from "../../components/noti";
import { useRootState } from "../../store";

const Info = ({ userInfo }) => {
  const [isEditInfo, setIsEditInfo] = useState(false);
  const [isEditContact, setIsEditContact] = useState(false);
  const [isEditJob, setIsEditJob] = useState(false);
  const [infoEdit, setInfoEdit] = useState({});
  const [initInfoEdit, setInitInfoEdit] = useState({});
  const [loading, setLoading] = useState(false);
  const setUserInfo = useRootState((state) => state.setUserInfo);

  const updateUserInfo = async () => {
    setLoading(true);
    try {
      const res = await UserServices.updateUser(infoEdit?._id, infoEdit);
      setUserInfo(res.data);
      setLoading(false);
      Toast("success", res?.message);
    } catch (error) {
      setInfoEdit(_.cloneDeep(initInfoEdit));
      setLoading(false);
      Toast("success", error?.response?.data?.message);
    }
  };
  useEffect(() => {
    setInfoEdit(_.cloneDeep(userInfo));
    setInitInfoEdit(_.cloneDeep(userInfo));
  }, [JSON.stringify(userInfo)]);
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
          {!isEditInfo ? (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                setIsEditInfo(true);
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
                  setIsEditInfo(false);
                  setInfoEdit({
                    ...infoEdit,
                    display_name: initInfoEdit?.display_name,
                    birth: initInfoEdit?.birth,
                    address: initInfoEdit?.address,
                  });
                }}
              >
                Hủy
              </button>
              <button
                className="btn-green !px-7"
                onClick={() => {
                  setIsEditInfo(false);
                  updateUserInfo();
                }}
              >
                Lưu
              </button>
            </div>
          )}
        </div>
        <div className="mt-5">
          <div className="flex mt-3">
            <div className="w-1/5 text-neutral-500 text-lg font-medium">Tên hiển thị</div>
            <div className="w-4/5 ">
              {isEditInfo ? (
                <Input
                  value={infoEdit?.display_name}
                  onChange={(e) => {
                    setInfoEdit({ ...infoEdit, display_name: e.target.value });
                  }}
                />
              ) : (
                <p className="font-bold">{infoEdit?.display_name}</p>
              )}
            </div>
          </div>
          <div className="flex mt-3">
            <div className="w-1/5 text-neutral-500 text-lg font-medium">Email</div>
            <div className="w-4/5 ">
              {isEditInfo ? (
                <Input value={infoEdit?.email} disabled />
              ) : (
                <p className="font-bold text-green-500">{infoEdit?.email}</p>
              )}

              <p className="text-base text-neutral-500 mt-2">
                <AiFillInfoCircle className="text-green-500 float-left mt-1 mr-2 w-5 h-5" />
                Tài khoản đăng nhập không thể thay đổi
              </p>
            </div>
          </div>
          <div className="flex mt-3">
            <div className="w-1/5 text-neutral-500 text-lg font-medium">Ngày sinh</div>
            <div className="w-4/5">
              {isEditInfo ? (
                <Date type="date" value={infoEdit?.birth} onChange={(e) => setInfoEdit({ ...infoEdit, birth: e })} />
              ) : (
                <p className="font-bold">{convertTimeStampToString(infoEdit?.birth) || "(Chưa cập nhật)"}</p>
              )}
            </div>
          </div>
          <div className="flex mt-3">
            <div className="w-1/5 text-neutral-500 text-lg font-medium">Địa chỉ</div>
            <div className="w-4/5">
              {isEditInfo ? (
                <Input
                  value={infoEdit?.address}
                  onChange={(e) => {
                    setInfoEdit({ ...infoEdit, address: e.target.value });
                  }}
                />
              ) : (
                <p className="font-bold">{infoEdit?.address}</p>
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
          {!isEditContact ? (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                setIsEditContact(true);
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
                  setIsEditContact(false);
                  setInfoEdit({
                    ...infoEdit,
                    display_name: initInfoEdit?.display_name,
                    birth: initInfoEdit?.birth,
                    address: initInfoEdit?.address,
                  });
                }}
              >
                Hủy
              </button>
              <button
                className="btn-green !px-7"
                onClick={() => {
                  setIsEditContact(false);
                  updateUserInfo();
                }}
              >
                Lưu
              </button>
            </div>
          )}
        </div>
        <div className="mt-5">
          <div className="flex mt-3">
            <div className="w-1/5 text-neutral-500 text-lg font-medium">Số điện thoại</div>
            <div className="w-4/5 ">
              {isEditContact ? (
                <Input
                  value={infoEdit?.phone}
                  onChange={(e) => {
                    setInfoEdit({
                      ...infoEdit,
                      phone: e?.target?.value,
                    });
                  }}
                />
              ) : (
                <p className="font-bold">{infoEdit?.phone}</p>
              )}
            </div>
          </div>
          <div className="flex mt-3">
            <div className="w-1/5 text-neutral-500 text-lg font-medium">Đường dẫn</div>
            <div className="w-4/5 ">
              {isEditContact ? (
                <Input value={`http://localhost:5173/profile/${userInfo?.employee_id}`} disabled />
              ) : (
                <p className="font-bold  text-green-500">{`/profile/${userInfo?.employee_id}`}</p>
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
          {!isEditJob ? (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                setIsEditJob(true);
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
                  setIsEditJob(false);
                  //
                }}
              >
                Hủy
              </button>
              <button
                className="btn-green !px-7"
                onClick={() => {
                  setIsEditJob(false);
                }}
              >
                Lưu
              </button>
            </div>
          )}
        </div>
        <div className="mt-5">
          <div className="flex mt-3">
            <div className="w-1/5 text-neutral-500 text-lg font-medium">Tổ chức</div>
            <div className="w-4/5 ">
              {isEditJob ? <Input value={"Getfly"} disabled /> : <p className="font-bold">{"Getfly"}</p>}
            </div>
          </div>
          <div className="flex mt-3">
            <div className="w-1/5 text-neutral-500 text-lg font-medium">Mã nhân viên</div>
            <div className="w-4/5 ">
              {isEditJob ? (
                <Input
                  value={infoEdit?.employee_id}
                  onChange={(e) => {
                    setInfoEdit({ ...infoEdit, employee_id: e.target.value });
                  }}
                  disabled
                />
              ) : (
                <p className="font-bold text-green-500">{infoEdit?.employee_id}</p>
              )}
            </div>
          </div>
          <div className="flex mt-3">
            <div className="w-1/5 text-neutral-500 text-lg font-medium">Vị trí</div>
            <div className="w-4/5 font-bold">
              {userInfo?.department?.name} - {userInfo?.position?.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
