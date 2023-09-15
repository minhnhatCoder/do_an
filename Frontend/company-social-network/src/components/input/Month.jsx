/*
 * @description
 * @since         Sunday, 7 23rd 2023, 0:49:47 am
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */

import { DatePicker, Input } from "antd";
import React from "react";

const Month = ({ title, value, onChange, className, required, disabled, format }) => {
  return (
    <div className={className}>
      {title && (
        <p className="mb-2">
          {title}
          {required && <span className="ml-2 text-red-500">(*)</span>}
        </p>
      )}

      <DatePicker
        allowEmpty={false}
        picker="month"
        disabled={disabled}
        className={`w-full h-10`}
        format={format}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Month;
