/*
 * @description
 * @since         Wednesday, 8 9th 2023, 20:26:46 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */
import { Avatar } from "antd";
import React from "react";
import AvatarUi from "./index";

const AvatarGroupUi = ({ data, size = "default", max }) => {
  return (
    <Avatar.Group>
      {data?.map((item, index) => {
        if (index < max) {
          return <AvatarUi data={item} key={index} size={size} />;
        }
      })}
      {data?.length > max && (
        <Avatar size={size} className="bg-gray-400 cursor-pointer">
          +{data?.length - max}
        </Avatar>
      )}
    </Avatar.Group>
  );
};

export default AvatarGroupUi;
