'use strict';
const crypto = require('crypto');

module.exports = {
  /**
   * MD5加密
   * @param {*} param str
   */
  md5(param) {
    const md5 = crypto.createHash('md5');
    return md5.update(param + 'coca').digest('hex');
  },

  /**
   * 加密密码
   * @param {*} account 账号
   * @param {*} password 密码
   */
  signPassword(account, password) {
    // console.log(account, this.md5(this.md5(password) + account));
    this.logger.debug(
      `account: ${account}, password: ${this.md5(this.md5(password) + account)}`
    );
    return this.md5(this.md5(password) + account);
  },
};
