import bcrypt from 'bcryptjs';

// 加密密码  
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// 验证密码  
export const verifyPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};  