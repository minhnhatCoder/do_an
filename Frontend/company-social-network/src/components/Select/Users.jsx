/*
 * @description
 * @since         Wednesday, 8 2nd 2023, 21:09:06 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */

import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useRootState } from "../../store";
import { Avatar } from "antd";

const SelectUsers = ({
  title,
  value,
  onChange,
  className,
  required,
  disabled,
  isMulti,
  menuPlacement,
  isClearable,
  usersId,
  placeholder,
}) => {
  const users = useRootState((state) => state.users);
  const [options, setOptions] = useState([]);
  useEffect(() => {
    setOptions(
      users.map((user) => ({
        value: user._id,
        label: user.display_name,
        image: user.image,
        department: user?.department,
        position: user?.position,
      }))
    );
  }, [users?.length]);

  useEffect(() => {
    if (usersId?.length > 0) {
      setOptions(options?.filter((opt) => usersId?.includes(opt?.value)));
    } else {
      setOptions(
        users.map((user) => ({
          value: user._id,
          label: user.display_name,
          image: user.image,
          department: user?.department,
          position: user?.position,
        }))
      );
    }
  }, [usersId]);
  const CustomOption = ({ innerProps, label, data }) => {
    return (
      <div {...innerProps} className="flex items-center p-2 gap-2 hover:text-white hover:bg-blue-500 cursor-pointer">
        <Avatar size={"large"} src={data?.image} />
        <div>
          <p className="font-bold text-base"> {label}</p>
          <p className=" text-xs">
            {data?.department?.name} - {data?.position?.name}
          </p>
        </div>
      </div>
    );
  };

  const formatSelectedValues = (data) => {
    if (data) {
      return (
        <div className="flex items-center gap-2">
          <img src={data?.image} style={{ width: "30px", height: "30px", borderRadius: "50%" }} />
          {data?.label}
        </div>
      );
    }
    return null;
  };

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
        components={{ Option: CustomOption }}
        placeholder={placeholder}
        menuPlacement={menuPlacement}
        closeMenuOnSelect={isMulti ? false : true}
        value={
          isMulti
            ? options.filter((opt) => value?.includes(opt?.value)) ?? []
            : options.find((opt) => opt?.value == value) ?? null
        }
        formatOptionLabel={formatSelectedValues}
        onChange={onChange}
      />
    </div>
  );
};

export default SelectUsers;
