import authService from '../services/auth.js';

// 用户注册  
export const register = async (ctx) => {
  const { phone, password, verification_code, gender } = ctx.request.body;
  const result = await authService.register(phone, password, verification_code, gender);

  ctx.status = 201;
  ctx.body = {
    message: '注册成功',
    token: result.token,
    user: {
      id: result.user.id,
      phone: result.user.phone
    }
  };
};

// 密码登录  
export const loginWithPassword = async (ctx) => {
  const { phone, password } = ctx.request.body;
  const result = await authService.loginWithPassword(phone, password);

  ctx.body = {
    message: '登录成功',
    token: result.token,
    user: {
      id: result.user.id,
      phone: result.user.phone
    }
  };
};

// 验证码登录  
export const loginWithCode = async (ctx) => {
  const { phone, verification_code } = ctx.request.body;
  const result = await authService.loginWithCode(phone, verification_code);

  ctx.body = {
    message: '登录成功',
    token: result.token,
    user: {
      id: result.user.id,
      phone: result.user.phone
    }
  };
};

// 发送验证码  
export const sendVerificationCode = async (ctx) => {
  const { phone, type } = ctx.request.body;
  const result = await authService.sendVerificationCode(phone, type);

  ctx.body = result;
};

// 重置密码  
export const resetPassword = async (ctx) => {
  const { phone, verification_code, new_password } = ctx.request.body;
  const result = await authService.resetPassword(phone, verification_code, new_password);

  ctx.body = result;
};  