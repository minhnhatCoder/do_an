import { Image } from "antd";
import { useState } from "react";
import { AiOutlineDownload } from "react-icons/ai";
import { FcFile } from "react-icons/fc";
import { getFileName, isImageFile } from "../../helper/fileHelper";
const File = ({ data }) => {
  return (
    <>
      {data?.map((file) => {
        if (isImageFile(file?.public_id)) {
          return (
            <div className="flex items-center justify-between p-3 rounded-lg border mb-2" key={file?._id}>
              <div className="flex items-center gap-3">
                <Image width={70} placeholder={<p>{getFileName(file?.public_id)}</p>} src={file?.url} />
                <p>{getFileName(file?.public_id)}</p>
              </div>
              <a href={file?.url} className="p-2 rounded-full hover:bg-gray-200 cursor-pointer">
                <AiOutlineDownload className="w-5 h-5" />
              </a>
            </div>
          );
        } else {
          return (
            <div className="flex items-center justify-between p-3 rounded-lg border" key={file?._id}>
              <div className="flex items-center gap-3">
                <FcFile className="w-16 h-16" />
                <p>{getFileName(file?.public_id)}</p>
              </div>
              <a href={file?.url} className="p-2 rounded-full hover:bg-gray-200 cursor-pointer">
                <AiOutlineDownload className="w-5 h-5" />
              </a>
            </div>
          );
        }
      })}
    </>
  );
};
export default File;
