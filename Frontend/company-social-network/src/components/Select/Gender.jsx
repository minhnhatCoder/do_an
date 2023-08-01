/*
 * @description
 * @since         Thursday, 7 27th 2023, 21:37:17 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */

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

const SelectGender = ({
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
    { value: "Nam", label: "Nam" },
    { value: "Nữ", label: "Nữ" },
    { value: "Khác", label: "Khác" },
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

export default SelectGender;
