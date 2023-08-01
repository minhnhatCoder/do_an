import React from "react";
import Select from "react-select";

const SelectUi = ({
  title,
  value,
  onChange,
  className,
  required,
  disabled,
  isMulti,
  menuPlacement,
  options,
  isClearable,
}) => {
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
        value={value}
        onChange={(e) => {
          onchange && onChange(e);
        }}
      />
    </div>
  );
};

export default SelectUi;
