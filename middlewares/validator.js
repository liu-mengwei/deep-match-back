import Joi from 'joi';

// 请求验证中间件  
export const validate = (schema) => {
  return async (ctx, next) => {
    try {
      // 根据请求方法选择验证对象  
      const data = ['GET', 'DELETE'].includes(ctx.method)
        ? ctx.query
        : ctx.request.body;

      const { error, value } = schema.validate(data, { abortEarly: false });

      if (error) {
        ctx.status = 400;
        ctx.body = {
          error: '请求数据验证失败',
          details: error.details.map(err => ({
            message: err.message,
            path: err.path
          }))
        };
        return;
      }

      // 将验证过的数据保存到上下文  
      if (['GET', 'DELETE'].includes(ctx.method)) {
        ctx.query = value;
      } else {
        ctx.request.body = value;
      }

      await next();
    } catch (err) {
      ctx.status = 400;
      ctx.body = { error: '请求数据验证失败' };
    }
  };
};  