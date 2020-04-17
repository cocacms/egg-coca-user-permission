"use strict";
module.exports = () => {
  return async function user(ctx, next) {
    let userId = null;

    const config = ctx.app.config.userPermimission;
    if (config.dirver === "session") {
      userId = ctx.session.loginedId;
    }

    if (config.dirver === "jwt") {
      const Authorization = ctx.get("Authorization");
      if (Authorization) {
        try {
          ctx.service.user.verify(Authorization.replace("Bearer ", ""));
        } catch (error) {
          ctx.throw(401, "验证失败/过期，请重新登录");
        }
        const payload = ctx.service.user.decode(
          Authorization.replace("Bearer ", "")
        );
        userId = payload.id;
      }
    }

    if (!userId) {
      ctx.throw(401, "请登录");
    }

    ctx.logined = await ctx.app.model.User.findOne({
      where: { id: userId },
      include: ["roles"],
    });

    await next();
  };
};
