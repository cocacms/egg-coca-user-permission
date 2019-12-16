'use strict';
const Serivce = require('egg').Service;
const jose = require('jose');
const ms = require('ms');

class UserService extends Serivce {
  /**
   * 登录
   * @param {*} account 账号
   * @param {*} password 密码
   */
  async login(account, password) {
    const { ctx, app } = this;
    const isExist = await app.model.User.findOne({
      where: { account },
    });
    this.app.signPassword(account, password);
    if (
      !isExist ||
      isExist.password !== this.app.signPassword(account, password)
    ) {
      ctx.throw('用户不存在/密码错误');
    }

    const config = this.config.userPermimission;
    this.ctx.logined = isExist;
    const returnData = await this.info();
    if (config.dirver === 'session') {
      ctx.session.loginedId = isExist.id;
      if (ctx.request.body.remember) ctx.session.maxAge = ms('365d');
    }

    if (config.dirver === 'jwt') {
      returnData.token = this.sign(isExist.id, ctx.request.body.remember);
    }

    return returnData;
  }

  /**
   * 登出
   */
  async logout() {
    const { ctx } = this;
    ctx.session.loginedId = null;
    return {};
  }

  /**
   * 修改密码
   * @param {*} password 旧密码
   * @param {*} newpassword 新密码
   */
  async changePassword(password, newpassword) {
    const { ctx, app } = this;

    if (
      this.ctx.logined.password !==
      this.app.signPassword(this.ctx.logined.account, password)
    ) {
      ctx.throw('密码不正确');
    }

    return await app.model.User.update(
      {
        password: this.app.signPassword(this.ctx.logined.account, newpassword),
      },
      {
        where: {
          id: this.ctx.logined.id,
        },
      }
    );
  }

  /**
   * 我的信息
   */
  async info() {
    const userData = this.ctx.logined.toJSON();
    delete userData.password;
    return userData;
  }

  sign(id, remember) {
    const config = this.config.userPermimission;
    const {
      JWK: { asKey },
    } = jose;
    const key = asKey(...config.jwk.private);
    return jose.JWT.sign({ id, _t: new Date().valueOf() }, key, {
      algorithm: config.algorithm,
      audience: 'coca:user:id',
      expiresIn: remember ? '1 year' : '24 hours',
      header: {
        typ: 'JWT',
      },
      issuer: 'cocaUserPermission',
    });
  }

  verify(token) {
    const config = this.config.userPermimission;
    const {
      JWK: { asKey },
    } = jose;

    const key = asKey(...config.jwk.public);
    jose.JWT.verify(token, key, {
      algorithms: [ config.algorithm ],
      audience: 'coca:user:id',
      issuer: 'cocaUserPermission',
    });
  }

  decode(token) {
    return jose.JWT.decode(token);
  }
}

module.exports = UserService;
