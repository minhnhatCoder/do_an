/*
 * @description
 * @since         Saturday, 8 19th 2023, 8:03:40 am
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoIosNotifications } from "react-icons/io";
import { Image, Modal, Switch, Tabs } from "antd";
import { BsFillInfoCircleFill, BsImages } from "react-icons/bs";
import { AiOutlineFileText, AiOutlinePaperClip } from "react-icons/ai";
import { GrShieldSecurity } from "react-icons/gr";
import { useRootState } from "../../store";
import { getFileName, isImageFile } from "../../helper/fileHelper";

const Info = ({ conversation }) => {
  const userInfo = useRootState((state) => state.userInfo);
  const usersOnline = useRootState((state) => state?.usersOnline);
  const [show, setShow] = useState(false);
  const [tab, setTab] = useState("1");

  return (
    <div className="w-1/3 h-[calc(100vh-75px)] overflow-y-auto">
      <div className="p-4 border-b flex items-center justify-center gap-2">
        <BsFillInfoCircleFill className="w-4 h-4 text-blue-600" />
        <p className="text-lg font-bold text-center">
          Thông tin cuộc hội thoại
        </p>
      </div>
      {conversation?.type == "personal" ? (
        <>
          <div className="flex items-center justify-center mt-3">
            <div className="relative">
              <img
                className="w-20 h-20 rounded-full object-cover"
                src={
                  conversation?.participants?.find(
                    (p) => p?._id != userInfo?._id
                  )?.image || conversation?.participants?.[0]?.image
                }
                alt="Large avatar"
              />
              {usersOnline?.find(
                (on) =>
                  on?._id ==
                    conversation?.participants?.find(
                      (p) => p?._id != userInfo?._id
                    )?._id ||
                  conversation?.participants?.every(
                    (p) => p?._id == userInfo?._id
                  )
              ) ? (
                <span className="bottom-0 left-14 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white  rounded-full"></span>
              ) : null}
            </div>
          </div>
          <div className="mt-2">
            <Link
              className="text-gray-700 text-base font-bold text-center cursor-pointer block hover:underline"
              to={`/profile/${
                conversation?.participants?.find((p) => p?._id != userInfo?._id)
                  ?._id || conversation?.participants?.[0]?._id
              }`}
            >
              {conversation?.participants?.find((p) => p?._id != userInfo?._id)
                ?.display_name || conversation?.participants?.[0]?.display_name}
            </Link>
            <p className="text-gray-400 text-xs text-center">
              {usersOnline?.find(
                (on) =>
                  on?._id ==
                    conversation?.participants?.find(
                      (p) => p?._id != userInfo?._id
                    )?._id ||
                  conversation?.participants?.every(
                    (p) => p?._id == userInfo?._id
                  )
              )
                ? "Đang hoạt động"
                : "Đang offline"}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-center mt-3">
            <div className="relative">
              <img
                className="w-20 h-20 rounded-full"
                src="https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/1/3/1134251/Cha-Eun-Woo2.jpeg"
                alt="Large avatar"
              />
              <span className="bottom-0 left-14 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white  rounded-full"></span>
            </div>
          </div>
          <div className="mt-2">
            <Link className="text-gray-700 text-base font-bold text-center cursor-pointer block hover:underline">
              Cha Eun Woo
            </Link>
            <p className="text-gray-400 text-xs text-center">Đang hoạt động</p>
          </div>
        </>
      )}

      <div className="flex items-center justify-between py-4 px-6 border-b mt-4">
        <div className="flex gap-2 items-center">
          <IoIosNotifications className="w-5 h-5 text-neutral-400" />
          <p className="text-neutral-400">Thông báo</p>
        </div>
        <Switch defaultChecked />
      </div>
      <div className="py-4 px-6 border-b mt-4">
        <div className="flex items-center justify-between ">
          <div className="flex gap-2 items-center">
            <BsImages className="w-5 h-5 text-neutral-400" />
            <p className="text-neutral-400">Hình ảnh</p>
            {conversation?.attachments?.filter((img) =>
              isImageFile(img?.public_id)
            )?.length > 0 && (
              <p className="text-[#1053f3] px-2 text-xs font-semibold bg-[#eaf0ff] rounded-md">
                {
                  conversation?.attachments?.filter((img) =>
                    isImageFile(img?.public_id)
                  )?.length
                }
              </p>
            )}
          </div>
          {conversation?.attachments?.filter((img) =>
            isImageFile(img?.public_id)
          )?.length > 3 && (
            <p
              className="text-neutral-400 cursor-pointer hover:underline text-xs"
              onClick={() => {
                setShow(true);
                setTab("1");
              }}
            >
              Xem thêm
            </p>
          )}
        </div>
        <div className="flex items-center mt-2 gap-2">
          {conversation?.attachments
            ?.filter((img) => isImageFile(img?.public_id))
            ?.map((attachment, index) => {
              if (index < 3) {
                return (
                  <Image
                    key={index}
                    className="!w-20 !h-20 rounded-lg"
                    src={attachment?.url}
                  />
                );
              }
            })}
          {conversation?.attachments?.filter((img) =>
            isImageFile(img?.public_id)
          )?.length > 3 && (
            <div className="!w-20 !h-20 rounded-lg relative">
              <img
                src={conversation?.attachments?.[4]?.url}
                className="!w-20 !h-20 rounded-lg"
              />
              <div className="img-mask rounded-lg">
                <p className="z-10 text-white opacity-100">
                  +
                  {conversation?.attachments?.filter((img) =>
                    isImageFile(img?.public_id)
                  )?.length - 4}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="py-4 px-6 border-b mt-4 flex flex-col gap-2">
        <div className="flex items-center justify-between ">
          <div className="flex gap-2 items-center">
            <AiOutlineFileText className="w-5 h-5 text-neutral-400" />
            <p className="text-neutral-400">Files</p>
            {conversation?.attachments?.filter(
              (img) => !isImageFile(img?.public_id)
            )?.length > 0 && (
              <p className="text-[#1053f3] px-2 text-xs font-semibold bg-[#eaf0ff] rounded-md">
                {
                  conversation?.attachments?.filter(
                    (img) => !isImageFile(img?.public_id)
                  )?.length
                }
              </p>
            )}
          </div>
          {conversation?.attachments?.filter(
            (img) => !isImageFile(img?.public_id)
          )?.length > 3 && (
            <p
              className="text-neutral-400 cursor-pointer hover:underline text-xs"
              onClick={() => {
                setShow(true);
                setTab("2");
              }}
            >
              Xem thêm
            </p>
          )}
        </div>
        {conversation?.attachments
          ?.filter((img) => !isImageFile(img?.public_id))
          ?.map((file, index) => {
            if (index < 4)
              return (
                <div className="flex items-center gap-1" key={index}>
                  <AiOutlinePaperClip className="w-5 h-5 cursor-pointer text-neutral-400" />
                  <a
                    className="text-neutral-400 hover:underline text-sm"
                    href={file?.url}
                  >
                    {getFileName(file?.public_id)}
                  </a>
                </div>
              );
          })}
      </div>

      <div className="flex items-center justify-between py-4 px-6 border-b mt-4">
        <div className="flex gap-2 items-center">
          <GrShieldSecurity className="w-5 h-5 !text-neutral-400" />
          <p className="text-neutral-400">Quyền riêng tư & hỗ trợ</p>
        </div>
        <p className="text-neutral-400 cursor-pointer hover:underline text-xs">
          Xem chi tiết
        </p>
      </div>
      <FileModal
        show={show}
        setShow={setShow}
        files={conversation?.attachments}
        tab={tab}
        setTab={setTab}
      />
    </div>
  );
};

export default Info;

const FileModal = ({ files, show, setShow, tab, setTab }) => {
  const items = [
    {
      key: "1",
      label: "Ảnh",
      children: (
        <div>
          <Image.PreviewGroup
            className="gap-2"
            preview={{
              onChange: (current, prev) =>
                console.log(`current index: ${current}, prev index: ${prev}`),
            }}
          >
            {files
              ?.filter((img) => isImageFile(img?.public_id))
              ?.map((attachment, index) => {
                return (
                  <Image
                    key={index}
                    className="!w-36 !h-36 rounded-lg"
                    src={attachment?.url}
                  />
                );
              })}
          </Image.PreviewGroup>
        </div>
      ),
    },
    {
      key: "2",
      label: "File",
      children: (
        <div>
          {files
            ?.filter((img) => !isImageFile(img?.public_id))
            ?.map((file, index) => {
              return (
                <div className="flex items-center gap-2" key={index}>
                  <AiOutlinePaperClip className="w-5 h-5 cursor-pointer text-neutral-400" />
                  <a
                    className="text-neutral-600 hover:underline text-base"
                    href={file?.url}
                  >
                    {getFileName(file?.public_id)}
                  </a>
                </div>
              );
            })}
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={
        <div className="flex items-center justify-center gap-2 border-b pb-2 border-gray-300">
          <p className="font-bold text-lg text-center">Tài liệu</p>
        </div>
      }
      open={show}
      footer={null}
      centered
      onCancel={() => setShow(false)}
      width={700}
    >
      <div className="p-3 h-[500px]  overflow-auto">
        <Tabs
          centered
          items={items}
          activeKey={tab}
          onChange={(e) => {
            setTab(String(e));
          }}
        />
      </div>
    </Modal>
  );
};
