'use strict';

module.exports = actionName => {
  return async function permission(ctx, next) {
    const permissions = ctx.app.config.permission;
    /**
     * 规则，
     * super 超级管理员 无视任何权限，无视资源归属
     * admin 管理员 无视资源归属，受角色权限限制
     * normal 普通账号 判断资源归属，受角色权限限制 资源必须有 user_id 字段
     */

    if (ctx.logined.type !== 'super') {
      const can =
        [ ...ctx.logined.roles ].filter(x => {
          return (
            Array.isArray(x.permission) && x.permission.includes(actionName)
          );
        }).length > 0;

      if (!can) {
        ctx.throw(
          403,
          `您的账号没有【${permissions[actionName] || actionName}】的操作权限`
        );
      }
    }

    // 判断资源归属
    if (ctx.logined.type === 'normal') {
      ctx.where = {
        user_id: ctx.logined.id,
      };
    }

    await next();
  };
};
