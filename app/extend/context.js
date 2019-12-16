'use strict';
const LOGINED = Symbol('Context#logined');

module.exports = {
  get logined() {
    if (!this[LOGINED]) {
      this.throw(401, '未登录');
    }
    return this[LOGINED];
  },

  set logined(value) {
    this[LOGINED] = value;
  },
};
