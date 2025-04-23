import profileService from '../services/profile.js';

// 获取当前用户资料  
export const getCurrentProfile = async (ctx) => {
  const userId = ctx.state.user.id;
  const profile = await profileService.getProfile(userId);

  if (!profile) {
    ctx.body = { message: '用户资料尚未创建' };
    return;
  }

  ctx.body = profile;
};

// 更新当前用户资料  
export const updateProfile = async (ctx) => {
  const userId = ctx.state.user.id;
  const profileData = ctx.request.body;

  const profile = await profileService.updateProfile(userId, profileData);

  ctx.body = profile;
};

// 上传头像  
export const uploadAvatar = async (ctx) => {
  const userId = ctx.state.user.id;

  // 这里应该处理文件上传，实际应用中通常使用云存储  
  // 这里简化为接收一个头像URL  
  const { avatar_url } = ctx.request.body;

  const profile = await profileService.updateAvatar(userId, avatar_url);

  ctx.body = {
    message: '头像更新成功',
    avatar: profile.avatar
  };
};  