'use strict';
const md5 = require('../util/md5');

module.exports = {
  /**
   * MD5加密
   * @param {*} param str
   */
  md5,

  /**
   * 加密密码
   * @param {*} account 账号
   * @param {*} password 密码
   */
  signPassword(account, password) {
    return this.md5(this.md5(password) + account);
  },
};
