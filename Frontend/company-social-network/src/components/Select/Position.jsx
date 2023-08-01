/*
 * @description
 * @since         Thursday, 7 27th 2023, 21:15:01 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */
import React, { useEffect, useState } from "react";
import { useRootState } from "../../store";
import Select from "react-select";

const SelectPosition = ({
  title,
  value,
  onChange,
  className,
  required,
  disabled,
  isMulti,
  menuPlacement,
  isClearable,
  deptId,
}) => {
  const positions = useRootState((state) => state.positions);
  const [options, setOptions] = useState([]);
  useEffect(() => {
    setOptions(
      positions
        .filter((pos) => pos.department?._id == deptId)
        .map((pos) => ({
          value: pos._id,
          label: pos.name,
        }))
    );
  }, [deptId]);
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

export default SelectPosition;
