import userService from '../services/user.js';

// 获取当前用户信息  
export const getCurrentUser = async (ctx) => {
  const userId = ctx.state.user.id;
  const user = await userService.getUserById(userId);

  ctx.body = user;
};

// 更新用户密码  
export const updatePassword = async (ctx) => {
  const userId = ctx.state.user.id;
  const { currentPassword, newPassword } = ctx.request.body;

  const result = await userService.updatePassword(userId, currentPassword, newPassword);

  ctx.body = result;
};