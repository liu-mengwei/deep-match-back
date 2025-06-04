import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import helmet from 'koa-helmet';
import logger from 'koa-logger';
import { koaSwagger } from 'koa2-swagger-ui';

import config from './config/index.js';
import errorHandler from './middlewares/error.js';
import router from './routes/index.js';
import db from './models/index.js';

const app = new Koa();

// 中间件  
app.use(errorHandler);
app.use(helmet());
app.use(cors());
app.use(logger());
app.use(bodyParser());

// Swagger UI  
app.use(
  koaSwagger({
    routePrefix: '/api/docs',
    swaggerOptions: {
      url: '/api/swagger.json',
    },
  })
);

// 路由  
app.use(router.routes());
app.use(router.allowedMethods());

// 未匹配的路由  
app.use(async (ctx) => {
  ctx.status = 404;
  ctx.body = { error: '资源不存在' };
});

// 启动服务器  
const PORT = config.port;

async function startServer() {
  try {
    // 连接数据库  
    await db.sequelize.authenticate();
    console.log('数据库连接成功');

    // 同步数据库模型（开发环境）  
    if (config.env === 'development') {
      await db.sequelize.sync();
      console.log('数据库同步完成');
    }

    // 启动服务器  
    app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`);
      console.log(`API文档地址: http://localhost:${PORT}/api/docs`);
    });
  } catch (error) {
    console.error('启动服务器失败:', error);
  }
}

startServer();

export default app;  