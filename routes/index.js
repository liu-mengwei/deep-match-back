import Router from 'koa-router';
import authRoutes from './auth.js';
import userRoutes from './user.js';
import profileRoutes from './profile.js';

const router = new Router({ prefix: '/api/v1' });

// 注册各模块路由  
router.use('/auth', authRoutes.routes(), authRoutes.allowedMethods());
router.use('/users', userRoutes.routes(), userRoutes.allowedMethods());
router.use('/profiles', profileRoutes.routes(), profileRoutes.allowedMethods());

export default router;  