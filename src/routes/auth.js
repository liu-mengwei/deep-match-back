import Router from 'koa-router';
import { validate } from '../middlewares/validator.js';
import schemas from '../utils/validator.js';
import * as authController from '../controllers/auth.js';

const router = new Router();

// 注册  
router.post(
  '/register',
  validate(schemas.registerSchema),
  authController.register
);

// 密码登录  
router.post(
  '/login/password',
  validate(schemas.passwordLoginSchema),
  authController.loginWithPassword
);

// 验证码登录  
router.post(
  '/login/verification-code',
  validate(schemas.codeLoginSchema),
  authController.loginWithCode
);

// 发送验证码  
router.post(
  '/verification-code',
  validate(schemas.sendCodeSchema),
  authController.sendVerificationCode
);

// 重置密码  
router.post(
  '/reset-password',
  validate(schemas.resetPasswordSchema),
  authController.resetPassword
);

export default router;  