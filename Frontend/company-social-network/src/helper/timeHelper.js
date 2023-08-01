/*
 * @description
 * @since         Saturday, 7 22nd 2023, 21:37:55 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */

import dayjs from "dayjs";

export const convertTimeStampToString = (timeStamp, position) => {
  if (position == "left") {
    return dayjs(timeStamp * 1000).format("HH:mm DD/MM/YYYY");
  }
  if (position == "right") {
    return dayjs(timeStamp * 1000).format("DD/MM/YYYY HH:mm");
  }
  return dayjs(timeStamp * 1000).format("DD/MM/YYYY") || null;
};  
