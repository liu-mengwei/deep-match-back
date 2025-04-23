import Router from 'koa-router';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validator.js';
import schemas from '../utils/validator.js';
import * as profileController from '../controllers/profile.js';

const router = new Router();

// 所有路由需要认证  
router.use(authenticate);

// 获取当前用户资料  
router.get('/me', profileController.getCurrentProfile);

// 更新当前用户资料  
router.put(
  '/me',
  validate(schemas.profileUpdateSchema),
  profileController.updateProfile
);

// 上传头像  
router.post('/me/avatar', profileController.uploadAvatar);

export default router;  