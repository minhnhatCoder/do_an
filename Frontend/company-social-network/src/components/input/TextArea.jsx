/*
 * @description
 * @since         Sunday, 7 23rd 2023, 0:49:47 am
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */

import { Input } from "antd";
import React from "react";

const { TextArea } = Input;
const Text = ({ title, value, onChange, className, required, disabled, rows = 3 }) => {
  return (
    <div className={className}>
      {title && (
        <p className="mb-2">
          {title}
          {required && <span className="ml-2 text-red-500">(*)</span>}
        </p>
      )}

      <TextArea rows={rows} disabled={disabled} className={`w-full`} value={value} onChange={onChange} />
    </div>
  );
};

export default Text;
