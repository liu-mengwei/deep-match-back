import db from '../models/index.js';

const { UserProfile } = db;

class ProfileService {
  // 获取用户资料  
  async getProfile(userId) {
    const profile = await UserProfile.findOne({
      where: { user_id: userId }
    });

    return profile;
  }

  // 更新或创建用户资料  
  async updateProfile(userId, profileData) {
    // 查找现有资料  
    let profile = await UserProfile.findOne({
      where: { user_id: userId }
    });

    // 如果不存在则创建  
    if (!profile) {
      profile = await UserProfile.create({
        user_id: userId,
        ...profileData
      });
    } else {
      // 更新现有资料  
      await profile.update(profileData);
    }

    return profile;
  }

  // 更新用户头像  
  async updateAvatar(userId, avatarUrl) {
    // 查找现有资料  
    let profile = await UserProfile.findOne({
      where: { user_id: userId }
    });

    // 如果不存在则创建  
    if (!profile) {
      profile = await UserProfile.create({
        user_id: userId,
        avatar: avatarUrl
      });
    } else {
      // 更新头像  
      await profile.update({ avatar: avatarUrl });
    }

    return profile;
  }
}

export default new ProfileService();  