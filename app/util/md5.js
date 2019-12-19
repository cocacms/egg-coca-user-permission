"use strict";
const crypto = require("crypto");
/**
 * MD5加密
 * @param {*} param str
 */
module.exports = param => {
  const md5 = crypto.createHash("md5");
  return md5.update(param + "coca").digest("hex");
};
