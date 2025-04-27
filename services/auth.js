import db from '../models/index.js';
import { hashPassword, verifyPassword } from '../utils/bcrypt.js';
import { generateToken } from '../utils/jwt.js';
import smsService from './sms.js';
import config from '../config/index.js';

const { User, UserProfile, VerificationCode, sequelize } = db;

class AuthService {
  // 注册用户  
  async register(phone, password, verificationCode, gender) {
    const transaction = await sequelize.transaction();

    try {
      // 验证手机号是否已存在  
      const existingUser = await User.findOne({ where: { phone } });
      if (existingUser) {
        throw { status: 400, message: '该手机号已被注册' };
      }

      // 验证验证码  
      const verification = await this._verifyCode(phone, verificationCode, 'register');

      // 创建用户  
      const passwordHash = await hashPassword(password);
      const user = await User.create({
        phone,
        passwordHash: passwordHash,
        isVerified: true,
        gender
      }, { transaction });

      // 标记验证码为已使用  
      await VerificationCode.update(
        { isUsed: true },
        { where: { id: verification.id }, transaction }
      );

      await transaction.commit();

      // 生成令牌  
      const token = generateToken(user.id);

      return { user, token };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // 密码登录  
  async loginWithPassword(phone, password) {
    // 查找用户  
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      throw { status: 401, message: '手机号或密码错误' };
    }

    // 验证密码  
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw { status: 401, message: '手机号或密码错误' };
    }

    // 检查用户状态  
    if (!user.isActive) {
      throw { status: 403, message: '账户已被禁用' };
    }

    // 生成令牌  
    const token = generateToken(user.id);

    return { user, token };
  }

  // 验证码登录  
  async loginWithCode(phone, verificationCode) {
    const transaction = await sequelize.transaction();

    try {
      // 查找用户  
      const user = await User.findOne({ where: { phone } });
      if (!user) {
        throw { status: 400, message: '用户不存在，请先注册' };
      }

      // 验证验证码  
      const verification = await this._verifyCode(phone, verificationCode, 'login');

      // 检查用户状态  
      if (!user.isActive) {
        throw { status: 403, message: '账户已被禁用' };
      }

      // 标记验证码为已使用  
      await VerificationCode.update(
        { isUsed: true },
        { where: { id: verification.id }, transaction }
      );

      await transaction.commit();

      // 生成令牌  
      const token = generateToken(user.id);

      return { user, token };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // 发送验证码  
  async sendVerificationCode(phone, type) {
    // 根据不同场景进行验证  
    if (type === 'register') {
      // 注册场景：检查手机号是否已注册  
      const existingUser = await User.findOne({ where: { phone } });
      if (existingUser) {
        throw { status: 400, message: '该手机号已被注册' };
      }
    } else if (['login', 'reset_password'].includes(type)) {
      // 登录和重置密码场景：检查用户是否存在  
      const user = await User.findOne({ where: { phone } });
      if (!user) {
        throw { status: 400, message: '用户不存在，请先注册' };
      }
    }

    // 检查冷却期（1分钟内不能重复发送）  
    const lastCode = await VerificationCode.findOne({
      where: { phone, type },
      order: [['createdAt', 'DESC']]
    });

    if (lastCode) {
      const now = new Date();
      const createdAt = new Date(lastCode.createdAt);
      const diffSeconds = Math.floor((now - createdAt) / 1000);

      if (diffSeconds < 60) {
        throw { status: 400, message: '请求过于频繁，请稍后再试' };
      }
    }

    // 生成6位随机验证码  
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 设置过期时间  
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + config.verificationCode.expireSeconds);

    // 保存验证码  
    await VerificationCode.create({
      phone,
      code,
      type,
      expiresAt: expiresAt,
      isUsed: false
    });

    // 发送短信验证码  
    await smsService.sendVerificationCode(phone, code, type);

    return {
      message: '验证码已发送',
      code,
      expires_in: config.verificationCode.expireSeconds
    };
  }

  // 重置密码  
  async resetPassword(phone, verificationCode, newPassword) {
    const transaction = await sequelize.transaction();

    try {
      // 查找用户  
      const user = await User.findOne({ where: { phone } });
      if (!user) {
        throw { status: 400, message: '用户不存在' };
      }

      // 验证验证码  
      const verification = await this._verifyCode(phone, verificationCode, 'reset_password');

      // 更新密码  
      const passwordHash = await hashPassword(newPassword);
      await User.update(
        { passwordHash: passwordHash },
        { where: { id: user.id }, transaction }
      );

      // 标记验证码为已使用  
      await VerificationCode.update(
        { isUsed: true },
        { where: { id: verification.id }, transaction }
      );

      await transaction.commit();

      return { message: '密码重置成功' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // 内部方法：验证验证码  
  async _verifyCode(phone, code, type) {
    // 查找最新的未使用验证码  
    const verification = await VerificationCode.findOne({
      where: {
        phone,
        code,
        type,
        isUsed: false
      },
      order: [['createdAt', 'DESC']]
    });

    if (!verification) {
      throw { status: 400, message: '验证码无效或已过期' };
    }

    // 检查是否过期  
    if (new Date() > new Date(verification.expiresAt)) {
      throw { status: 400, message: '验证码已过期' };
    }

    return verification;
  }
}

export default new AuthService();