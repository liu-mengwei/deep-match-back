import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',

  // JWT配置  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },

  // 短信服务配置  
  sms: {
    accessKeyId: process.env.SMS_ACCESS_KEY_ID,
    accessKeySecret: process.env.SMS_ACCESS_KEY_SECRET,
    signName: process.env.SMS_SIGN_NAME || '约会应用',
    templates: {
      register: process.env.SMS_TEMPLATE_CODE_REGISTER,
      login: process.env.SMS_TEMPLATE_CODE_LOGIN,
      resetPassword: process.env.SMS_TEMPLATE_CODE_RESET_PASSWORD
    }
  },

  // 验证码配置  
  verificationCode: {
    expireSeconds: process.env.VERIFICATION_CODE_EXPIRE_SECONDS || 300, // 5分钟  
    length: 6
  }
};  