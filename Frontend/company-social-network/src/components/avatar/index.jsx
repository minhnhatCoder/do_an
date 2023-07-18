import { Avatar, Tooltip } from "antd";
import React from "react";

const AvatarUi = ({ data, size = "default" }) => {
  return (
    <Tooltip title={data?.name || ""} placement="top">
      <Avatar
        size={size}
        src={
          data?.src || "https://xsgames.co/randomusers/avatar.php?g=pixel&key=1"
        }
        style={{
          backgroundColor: "#87d068",
        }}
      />
    </Tooltip>
  );
};

export default AvatarUi;
