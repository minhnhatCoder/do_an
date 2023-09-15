import { DatePicker } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
const { RangePicker } = DatePicker;

const Date = ({ title, value, onChange, className, required, disabled, type = "date", allowClear }) => {
  const [selectedValue, setSelectedValue] = useState(null);
  useEffect(() => {
    if (value) {
      setSelectedValue(dayjs.unix(value)); // Biến đổi value thành đối tượng dayjs
    } else {
      setSelectedValue(null);
    }
  }, [value]);
  const handleDateChange = (date, dateString) => {
    // Chuyển đổi dateString thành timestamp sử dụng Day.js
    const timestamp = dayjs(dateString).unix();
    setSelectedValue(date);
    onChange && onChange(timestamp);
  };
  if (type == "date") {
    return (
      <div className={className}>
        {title && (
          <p className="mb-2">
            {title}
            {required && <span className="ml-2 text-red-500">(*)</span>}
          </p>
        )}

        <DatePicker
          disabled={disabled}
          className="w-full"
          onChange={handleDateChange}
          value={selectedValue ?? 0}
          allowClear={allowClear}
          // format="DD-MM-YYYY"
        />
      </div>
    );
  }
  if (type == "date-time") {
    return (
      <div className={className}>
        {title && (
          <p className="mb-2">
            {title}
            {required && <span className="ml-2 text-red-500">(*)</span>}
          </p>
        )}

        <DatePicker
          disabled={disabled}
          className="w-full"
          showTime
          allowClear={allowClear}
          //   onOk={onOk}
          onChange={handleDateChange}
          // format="DD-MM-YYYY HH:mm:ss"
          value={selectedValue ?? 0}
        />
      </div>
    );
  }
  if (type == "date-range") {
    return (
      <div className={className}>
        {title && (
          <p className="mb-2">
            {title}
            {required && <span className="ml-2 text-red-500">(*)</span>}
          </p>
        )}

        <RangePicker
          disabled={disabled}
          className="w-full"
          showTime
          allowClear={allowClear}
          //   onOk={onOk}
          onChange={handleDateChange}
          // format="DD-MM-YYYY HH:mm:ss"
          value={selectedValue ?? 0}
        />
      </div>
    );
  }
};

export default Date;
