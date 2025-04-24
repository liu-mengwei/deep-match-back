import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';


// 加密密码  
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// 验证密码  
export const verifyPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

// 生成JWT令牌  
export const generateToken = (userId) => {
  // 设置令牌有效期，例如7天  
  const expiresIn = config.jwt.expiresIn;
  const jwtSecret = config.jwt.secret;

  // 创建令牌负载(payload)  
  const payload = {
    id: userId,
    iat: Math.floor(Date.now() / 1000) // 令牌创建时间  
  };

  // 使用配置中的密钥签名JWT  
  return jwt.sign(payload, jwtSecret, { expiresIn });
};

// 验证JWT令牌  
export const verifyToken = (token) => {
  try {
    // 使用相同的密钥验证令牌  
    const decoded = jwt.verify(token, jwtSecret);
    return decoded;
  } catch (error) {
    // 如果验证失败（令牌无效、过期等），返回null  
    return null;
  }
};
