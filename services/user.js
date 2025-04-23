import db from '../models/index.js';
import { verifyPassword, hashPassword } from '../utils/bcrypt.js';

const { User, UserProfile } = db;

class UserService {
  // 获取用户信息  
  async getUserById(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          model: UserProfile,
          as: 'profile'
        }
      ]
    });

    if (!user) {
      throw { status: 404, message: '用户不存在' };
    }

    return user;
  }

  // 更新用户密码  
  async updatePassword(userId, currentPassword, newPassword) {
    // 查找用户  
    const user = await User.findByPk(userId);
    if (!user) {
      throw { status: 404, message: '用户不存在' };
    }

    // 验证当前密码  
    const isPasswordValid = await verifyPassword(currentPassword, user.password_hash);
    if (!isPasswordValid) {
      throw { status: 400, message: '当前密码错误' };
    }

    // 更新密码  
    const passwordHash = await hashPassword(newPassword);
    await User.update(
      { password_hash: passwordHash },
      { where: { id: userId } }
    );

    return { message: '密码更新成功' };
  }
}

export default new UserService();  