import { Avatar, Tooltip } from "antd";
import React from "react";

const AvatarUi = ({ data, size = "default", placement = "top" }) => {
  return (
    <Tooltip title={data?.display_name || ""} placement={placement}>
      <Avatar
        size={size}
        src={data?.image || "https://xsgames.co/randomusers/avatar.php?g=pixel&key=1"}
        className="border"
      />
    </Tooltip>
  );
};

export default AvatarUi;
