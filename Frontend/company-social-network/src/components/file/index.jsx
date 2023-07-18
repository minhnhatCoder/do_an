import { Image } from "antd";
import { useState } from "react";
import { AiOutlineDownload } from "react-icons/ai";
import { FcFile } from "react-icons/fc";
const File = ({ data }) => {
  return (
    <>
      <div className="flex items-center justify-between p-3 rounded-lg border mb-2">
        <div className="flex items-center gap-3">
          <Image
            width={70}
            placeholder={<p>Xem</p>}
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          />
          <p>Anh-gai-xinh.png</p>
        </div>
        <div className="p-2 rounded-full hover:bg-gray-200 cursor-pointer">
          <AiOutlineDownload className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-center justify-between p-3 rounded-lg border">
        <div className="flex items-center gap-3">
          <FcFile className="w-16 h-16" />
          <p>Anh-gai-xinh.png</p>
        </div>
        <div className="p-2 rounded-full hover:bg-gray-200 cursor-pointer">
          <AiOutlineDownload className="w-5 h-5" />
        </div>
      </div>
    </>
  );
};
export default File;
