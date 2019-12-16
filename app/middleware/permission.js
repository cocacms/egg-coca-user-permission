'use strict';

module.exports = actionName => {
  return async function permission(ctx, next) {
    const can =
      [ ...ctx.logined.roles ].filter(x => {
        return Array.isArray(x.permission) && x.permission.includes(actionName);
      }).length > 0;

    // 超级账号，无视任何权限
    if (!ctx.logined.superadmin && !can) {
      ctx.throw(403, `您的账号类型没有操作此权限 [action: ${actionName}]`);
    }

    await next();
  };
};
