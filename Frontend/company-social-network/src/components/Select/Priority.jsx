/*
 * @description
 * @since         Friday, 8 4th 2023, 21:53:33 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */

import React, { useState } from "react";
import Select from "react-select";

const SelectPriority = ({
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
    { value: 1, label: "Không ưu tiên" },
    { value: 2, label: "Mức độ ưu tiên thấp" },
    { value: 3, label: "Mức độ ưu tiên trung bình" },
    { value: 4, label: "Mức độ ưu tiên cao" },
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

export default SelectPriority;
