// 错误处理中间件  
export default async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error('Error:', err);

    ctx.status = err.status || 500;
    ctx.body = {
      error: err.message || '服务器内部错误'
    };

    // 如果是开发环境，返回堆栈信息  
    if (process.env.NODE_ENV === 'development') {
      ctx.body.stack = err.stack;
    }
  }
};  