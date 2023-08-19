import { Avatar, Tooltip } from "antd";
import React from "react";

const AvatarUi = ({ data, size = "default" }) => {
  return (
    <Tooltip title={data?.display_name || ""} placement="top">
      <Avatar size={size} src={data?.image || "https://xsgames.co/randomusers/avatar.php?g=pixel&key=1"} />
    </Tooltip>
  );
};

export default AvatarUi;
