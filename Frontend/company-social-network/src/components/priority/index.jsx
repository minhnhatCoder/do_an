import { Popover, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { BiSolidFlagAlt } from "react-icons/bi";
import { CgArrowsExchangeAltV } from "react-icons/cg";

const Priority = ({ id = 1, hideValue, onChange, hasTitle }) => {
  const [data, setData] = useState([
    { id: 1, label: "Mức độ ưu tiên cao" },
    { id: 2, label: "Mức độ ưu tiên trung bình" },
    { id: 3, label: "Mức độ ưu tiên thấp" },
    { id: 4, label: "Không ưu tiên" },
  ]);
  const [active, setActive] = useState(id);
  const handleShowTag = (id) => {
    switch (id) {
      case 1:
        return <Tag color="red">Cao</Tag>;
      case 2:
        return <Tag color="orange">Trung bình</Tag>;
      case 3:
        return <Tag color="blue">Thấp</Tag>;
      case 4:
        return <Tag color="gray">Không ưu tiên</Tag>;

      default:
        return <Tag color="red">Cao</Tag>;
    }
  };
  useEffect(() => {
    setActive(id);
    handleShowTag(id);
  }, [id]);

  const content = (
    <div className="w-[250px]">
      <div className="flex items-center justify-between p-2 rounded-lg bg-red-200 text-red-500 cursor-pointer hover:bg-red-100">
        <div className="flex items-center gap-2 ">
          <BiSolidFlagAlt className="w-6 h-6" />
          <p className="font-semibold">Độ ưu tiên cao</p>
        </div>
        {id == 1 && <AiOutlineCheck className="w-6 h-6" color="green" />}
      </div>
      <div className="flex items-center justify-between p-2 rounded-lg bg-orange-200 text-orange-500 mt-2 cursor-pointer hover:bg-orange-100">
        <div className="flex items-center gap-2 ">
          <BiSolidFlagAlt className="w-6 h-6" />
          <p className="font-semibold">Độ ưu tiên trung bình</p>
        </div>
        {id == 2 && <AiOutlineCheck className="w-6 h-6" color="green" />}
      </div>
      <div className="flex items-center justify-between p-2 rounded-lg bg-blue-200 text-blue-500 mt-2 cursor-pointer hover:bg-blue-100">
        <div className="flex items-center gap-2 ">
          <BiSolidFlagAlt className="w-6 h-6" />
          <p className="font-semibold">Độ ưu tiên thấp</p>
        </div>
        {id == 3 && <AiOutlineCheck className="w-6 h-6" color="green" />}
      </div>
      <div className="flex items-center justify-between p-2 rounded-lg bg-gray-200 text-gray-500 mt-2 cursor-pointer hover:bg-gray-100">
        <div className="flex items-center gap-2 ">
          <BiSolidFlagAlt className="w-6 h-6" />
          <p className="font-semibold">Không ưu tiên</p>
        </div>
        {id == 4 && <AiOutlineCheck className="w-6 h-6" color="green" />}
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center gap-2">
      {hasTitle && <p className="font-semibold">Ưu tiên</p>}
      {hideValue ? null : handleShowTag(id)}
      {onChange ? (
        <Popover placement="bottom" title={"Đặt độ ưu tiên"} content={content} trigger="click">
          <CgArrowsExchangeAltV className="hover:bg-gray-100 p-1 rounded-md w-6 h-6 cursor-pointer" />
        </Popover>
      ) : null}
    </div>
  );
};

export default Priority;
