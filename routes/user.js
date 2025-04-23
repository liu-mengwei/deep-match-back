import Router from 'koa-router';
import { authenticate } from '../middlewares/auth.js';
import * as userController from '../controllers/user.js';

const router = new Router();

// 所有路由需要认证  
router.use(authenticate);

// 获取当前用户信息  
router.get('/me', userController.getCurrentUser);

// 更新密码  
router.put('/me/password', userController.updatePassword);

export default router;  