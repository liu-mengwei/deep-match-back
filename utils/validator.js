import Joi from 'joi';

// 手机号验证  
const phoneSchema = Joi.string().pattern(/^1[3456789]\d{9}$/).required();

// 验证码验证  
const codeSchema = Joi.string().length(6).pattern(/^\d+$/).required();

// 密码验证  
const passwordSchema = Joi.string().min(6).max(30).required();

// 性别校验
const genderSchema = Joi.string().valid('male', 'female').required();

// 校验规则对象  
const schemas = {
  // 注册验证  
  registerSchema: Joi.object({
    phone: phoneSchema,
    password: passwordSchema,
    verificationCode: codeSchema, // 修改为驼峰命名
    gender: genderSchema
  }),

  // 密码登录验证  
  passwordLoginSchema: Joi.object({
    phone: phoneSchema,
    password: passwordSchema
  }),

  // 验证码登录验证  
  codeLoginSchema: Joi.object({
    phone: phoneSchema,
    verificationCode: codeSchema // 修改为驼峰命名
  }),

  // 发送验证码验证  
  sendCodeSchema: Joi.object({
    phone: phoneSchema,
    type: Joi.string().valid('register', 'login', 'resetPassword').required() // 修改为驼峰命名
  }),

  // 重置密码验证  
  resetPasswordSchema: Joi.object({
    phone: phoneSchema,
    verificationCode: codeSchema, // 修改为驼峰命名
    newPassword: passwordSchema // 修改为驼峰命名
  }),

  // 用户资料更新验证  
  profileUpdateSchema: Joi.object({
    nickname: Joi.string().max(50).allow(null, ''),
    gender: Joi.string().valid('male', 'female', 'other').allow(null, ''),
    birthday: Joi.date().iso().allow(null, ''),
    location: Joi.string().max(100).allow(null, ''),
    bio: Joi.string().max(500).allow(null, '')
  })
};

export default schemas;