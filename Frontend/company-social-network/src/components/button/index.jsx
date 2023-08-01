/*
 * @description
 * @since         Sunday, 7 23rd 2023, 20:25:34 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */
import React from "react";

const Button = ({ className, children, onClick, icon, disabled, disabledClassName }) => {
  if (disabled) {
    return (
      <button
        className={
          disabledClassName +
          " btn-gray !flex items-center justify-center gap-2 !cursor-not-allowed !text-gray-100 hover:!bg-gray-300"
        }
      >
        {icon && icon} <p className="w-max">{children}</p>
      </button>
    );
  } else
    return (
      <button className={className + " !flex items-center justify-center gap-2"} onClick={onClick}>
        {icon && icon} <p className="w-max">{children}</p>
      </button>
    );
};

export default Button;
