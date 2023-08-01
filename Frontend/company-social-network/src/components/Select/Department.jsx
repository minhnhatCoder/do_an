/*
 * @description
 * @since         Wednesday, 7 26th 2023, 22:29:06 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useRootState } from "../../store";

const SelectDepartment = ({
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
  const depts = useRootState((state) => state.depts);
  const [options, setOptions] = useState([]);
  useEffect(() => {
    setOptions(
      depts.map((dept) => ({
        value: dept._id,
        label: dept.name,
      }))
    );
  }, [depts?.length]);
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

export default SelectDepartment;
