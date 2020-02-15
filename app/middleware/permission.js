'use strict';
const router = {
  POST: 'create',
  PUT: 'update',
  DELETE: 'destroy',
};
module.exports = (permission_name, not = []) => {
  return async function permission(ctx, next) {
    const permissions = ctx.app.config.permission;
    /**
     * 规则，
     * super 超级管理员 无视任何权限，无视资源归属
     * admin 管理员 无视资源归属，受角色权限限制
     * normal 普通账号 判断资源归属，受角色权限限制 资源必须有 user_id 字段
     */

    if (not.length !== 0) {
      let routername = router[ctx.method];
      if (!routername && ctx.method === 'GET' && ctx._matchedRouteName) {
        routername =
          ctx._matchedRouteName.lastIndexOf('s') === -1 ? 'show' : 'index';
      }

      if (routername && not.includes(routername)) {
        await next();
        return;
      }
    }

    if (ctx.logined.type !== 'super') {
      const can =
        [ ...ctx.logined.roles ].filter(x => {
          return (
            Array.isArray(x.permission) &&
            x.permission.includes(permission_name)
          );
        }).length > 0;

      if (!can) {
        ctx.throw(
          403,
          `您的账号没有【${permissions[permission_name] ||
            permission_name}】的操作权限`
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
