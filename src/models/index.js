import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { Sequelize, DataTypes } from 'sequelize';
import config from '../config/index.js';
import dbConfig from '../config/database.js';

// 获取__dirname等价物（ES模块中没有直接的__dirname）  
const __filename = fileURLToPath(import.meta.url);
console.log(__filename, '__filename')

const __dirname = path.dirname(__filename);

const env = config.env;
const db = {};

// 创建Sequelize实例  
const sequelize = new Sequelize(
  dbConfig[env].database,
  dbConfig[env].username,
  dbConfig[env].password,
  {
    host: dbConfig[env].host,
    dialect: dbConfig[env].dialect,
    logging: dbConfig[env].logging,
    pool: dbConfig[env].pool,
    define: {
      underscored: true
    }
  }
);

// 动态导入所有模型  
const importModel = async (file) => {
  if (file !== path.basename(__filename) && file.endsWith('.js')) {
    const modelPath = path.join(__dirname, file);

    const modelPathUrl = pathToFileURL(modelPath).href;

    const modelModule = await import(modelPathUrl);

    const model = modelModule.default(sequelize, DataTypes);
    db[model.name] = model;
  }
};

// 读取当前目录下的所有JS文件并导入模型  
const initModels = async () => {
  const files = fs.readdirSync(__dirname);

  // 先导入所有模型  
  for (const file of files) {
    if (file !== path.basename(__filename) && file.endsWith('.js')) {
      await importModel(file);
    }
  }

  // 然后建立关联  
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
};

await initModels();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;  