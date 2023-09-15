/*
 * @description
 * @since         Saturday, 7 22nd 2023, 21:37:55 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import viLocale from "dayjs/locale/vi";
dayjs.extend(relativeTime);
dayjs.locale(viLocale);

const convertTimeStampToString = (timeStamp, position) => {
  if (position == "left") {
    return dayjs(timeStamp * 1000).format("HH:mm DD/MM/YYYY");
  }
  if (position == "right") {
    return dayjs(timeStamp * 1000).format("DD/MM/YYYY HH:mm");
  }
  return dayjs(timeStamp * 1000).format("DD/MM/YYYY") || null;
};

const getFullTimeFormatted = (timeStamp, hasTime) => {
  return `Ngày ${getDayOfTimeStamp(timeStamp)} tháng ${getMonthOfTimeStamp(timeStamp)} năm ${getYearOfTimeStamp(timeStamp)} ${hasTime ? `${getHourOfTimeStamp(timeStamp)}:${getMinuteOfTimeStamp(timeStamp)}` : ""}`
}
const getMonthOfTimeStamp = (timeStamp) => {
  return dayjs(timeStamp * 1000).month() || null;
};
const getDayOfTimeStamp = (timeStamp) => {
  return dayjs(timeStamp * 1000).date() || null;
};
const getYearOfTimeStamp = (timeStamp) => {
  return dayjs(timeStamp * 1000).year() || null;
};
const getHourOfTimeStamp = (timeStamp) => {
  return dayjs(timeStamp * 1000).hour() || null;
};
const getMinuteOfTimeStamp = (timeStamp) => {
  return dayjs(timeStamp * 1000).minute() || null;
};
const getSecondOfTimeStamp = (timeStamp) => {
  return dayjs(timeStamp * 1000).second() || null;
};


function timeAgo(timestamp) {
  const now = new Date();
  const fromTime = new Date(timestamp * 1000);
  const elapsedMilliseconds = now - fromTime;

  const seconds = Math.floor(elapsedMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return years + " năm";
  } else if (months > 0) {
    return months + " tháng";
  } else if (weeks > 0) {
    return weeks + " tuần";
  } else if (days > 0) {
    return days + " ngày";
  } else if (hours > 0) {
    return hours + " giờ";
  } else if (minutes > 0) {
    return minutes + " phút";
  } else {
    return seconds + " giây";
  }
}

function formatTimestamp(timestamp) {
  const currentDate = dayjs();
  const inputDate = dayjs(timestamp * 1000);

  // Check if the input date is from the same day
  if (inputDate.isSame(currentDate, 'day')) {
    return inputDate.format('hh:mm A');
  } else {
    return inputDate.format('DD/MM/YYYY');
  }
}

function getCurrentTimeStamp() {
  return dayjs().valueOf();
}

export { convertTimeStampToString, timeAgo, getMonthOfTimeStamp, getDayOfTimeStamp, getYearOfTimeStamp, getFullTimeFormatted, getHourOfTimeStamp, getMinuteOfTimeStamp, getSecondOfTimeStamp, formatTimestamp, getCurrentTimeStamp };
