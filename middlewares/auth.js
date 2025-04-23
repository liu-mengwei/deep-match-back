import { verifyToken } from '../utils/jwt.js';
import db from '../models/index.js';

const { User } = db;

// 认证中间件  
export const authenticate = async (ctx, next) => {
  try {
    // 获取Authorization头  
    const authHeader = ctx.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ctx.status = 401;
      ctx.body = { error: '未提供认证凭据' };
      return;
    }

    // 提取Token  
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      ctx.status = 401;
      ctx.body = { error: '无效的认证凭据' };
      return;
    }

    // 查找用户  
    const user = await User.findByPk(decoded.id);
    if (!user) {
      ctx.status = 401;
      ctx.body = { error: '用户不存在' };
      return;
    }

    if (!user.is_active) {
      ctx.status = 403;
      ctx.body = { error: '用户已被禁用' };
      return;
    }

    // 将用户信息添加到上下文中  
    ctx.state.user = user;
    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = { error: '认证失败' };
  }
};  