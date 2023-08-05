/*
 * @description
 * @since         Wednesday, 8 2nd 2023, 21:09:16 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */

import React, { useEffect, useState } from "react";
import Select from "react-select";
import TasksServices from "../../services/tasksServices";

const SelectProjects = ({
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
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const getProjects = async () => {
    setLoading(true);

    try {
      const res = await TasksServices.getProjects();
      setOptions(
        res?.data?.map((project) => ({
          value: project?._id,
          label: project?.title,
          related_users: project?.related_user,
        }))
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const onLoad = async () => {
    options?.length == 0 && (await getProjects());
  };
  useEffect(() => {
    value && getProjects();
  }, [value]);
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
        loading={loading}
        className="w-full"
        onFocus={onLoad}
        menuPlacement={menuPlacement}
        value={options.find((opt) => opt?.value == value) ?? null}
        onChange={onChange}
      />
    </div>
  );
};

export default SelectProjects;
