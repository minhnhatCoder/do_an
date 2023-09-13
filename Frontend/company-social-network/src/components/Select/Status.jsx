/*
 * @description
 * @since         Wednesday, 7 26th 2023, 22:29:06 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */
import React, { useState } from "react";
import Select from "react-select";

const SelectStatus = ({
  title,
  value,
  onChange,
  className,
  required,
  disabled,
  isMulti,
  menuPlacement,
  isClearable,
}) => {
  const [options, setOptions] = useState([
    { value: 1, label: "Đang làm việc" },
    { value: 0, label: "Đã nghỉ việc" },
  ]);

  return (
    <div className={className}>
      {title && (
        <p className="mb-2">
          {title}
          {required && <span className="ml-2 text-red-500">(*)</span>}
        </p>
      )}

      <Select
        options={options}
        isDisabled={disabled}
        isClearable={isClearable}
        isMulti={isMulti}
        className="w-full"
        menuPlacement={menuPlacement}
        value={options.find((opt) => opt?.value == value) ?? null}
        onChange={onChange}
      />
    </div>
  );
};

export default SelectStatus;
