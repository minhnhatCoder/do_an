import { DatePicker } from "antd";
import React from "react";

const Date = ({
  title,
  value,
  onChange,
  classname,
  required,
  disabled,
  type = "date",
  allowClear,
}) => {
  const onOk = (value) => {
    console.log("onOk: ", value);
  };
  if (type == "date") {
    return (
      <div className={classname}>
        {title && (
          <p className="mb-2">
            {title}
            {required && <span className="ml-2 text-red-500">(*)</span>}
          </p>
        )}

        <DatePicker
          disabled={disabled}
          className="w-full"
          value={value}
          allowClear={allowClear}
          onChange={(e) => {
            onchange && onChange(e?.target?.value);
          }}
        />
      </div>
    );
  }
  if (type == "date-time") {
    return (
      <div className={classname}>
        {title && (
          <p className="mb-2">
            {title}
            {required && <span className="ml-2 text-red-500">(*)</span>}
          </p>
        )}

        <DatePicker
          disabled={disabled}
          className="w-full"
          value={value}
          showTime
          allowClear={allowClear}
          //   onOk={onOk}
          onChange={(e) => {
            onchange && onChange(e?.target?.value);
          }}
        />
      </div>
    );
  }
};

export default Date;
