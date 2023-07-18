import { Input } from "antd";
import React from "react";

const Text = ({
  title,
  value,
  onChange,
  classname,
  required,
  disabled,
  type,
  isPassword,
}) => {
  return (
    <div className={classname}>
      {title && (
        <p className="mb-2">
          {title}
          {required && <span className="ml-2 text-red-500">(*)</span>}
        </p>
      )}
      {isPassword ? (
        <Input.Password
          disabled={disabled}
          className={`w-full ${type == "login" && "h-11"}`}
          value={value}
          onChange={onChange}
        />
      ) : (
        <Input
          disabled={disabled}
          className={`w-full ${type == "login" && "h-11"}`}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default Text;
