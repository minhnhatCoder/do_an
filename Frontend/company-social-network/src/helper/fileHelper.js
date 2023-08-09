/*
 * @description
 * @since         Wednesday, 8 9th 2023, 20:42:13 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */
function isImageFile(fileName) {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".webp"];
  const extension = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
  return imageExtensions.includes(extension);
}
function getFileName(fileName) {
  const startIndex = fileName.indexOf("files/") + "files/".length;

  if (startIndex >= "files/".length) {
    const desiredValue = fileName.slice(startIndex);
    return desiredValue;
  } else {
    return "";
  }
}
export { isImageFile, getFileName };
