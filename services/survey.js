import db from '../models/index.js';

const { Survey, User, sequelize } = db;

// 获取用户的问卷草稿  
export const getUserDraft = async (userId) => {
  const draft = await Survey.findOne({
    where: {
      userId: userId,
      status: 'draft'
    }
  });

  return draft;
};

// 保存问卷草稿  
export const saveDraft = async (userId, basicInfo, weights, basicFilter = null) => {
  const transaction = await sequelize.transaction();

  try {
    // 查找现有草稿  
    let draft = await Survey.findOne({
      where: { userId: userId, status: 'draft' },
      transaction
    });

    // 更新或创建草稿  
    if (draft) {
      await draft.update({ basicInfo, weights, basicFilter }, { transaction });
    } else {
      draft = await Survey.create({
        userId, basicInfo, weights, basicFilter, status: 'draft'
      }, { transaction });
    }

    await transaction.commit();
    return draft;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 更新问卷草稿
export const updateDraft = async (userId, draftData) => {
  const transaction = await sequelize.transaction();

  try {
    // 查找现有草稿  
    let draft = await Survey.findOne({
      where: { userId: userId, status: 'draft' },
      transaction
    });

    if (!draft) {
      throw new Error('找不到草稿');
    }

    // 更新草稿  
    await draft.update(draftData, { transaction });

    await transaction.commit();
    return draft;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 删除问卷草稿  
export const deleteDraft = async (userId) => {
  const transaction = await sequelize.transaction();

  try {
    const deleted = await Survey.destroy({
      where: { userId: userId, status: 'draft' },
      transaction
    });

    await transaction.commit();
    return deleted > 0;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 提交问卷  
export const submitSurvey = async (userId, basicInfo, weights, basicFilter = null) => {
  const transaction = await sequelize.transaction();

  try {
    // 查找现有草稿  
    let survey = await Survey.findOne({
      where: {
        userId: userId,
        status: 'draft'
      },
      transaction
    });

    // 计算结果  
    const results = await calculateResults(userId, basicInfo, weights);

    // 如果有草稿就更新，没有就创建新记录  
    if (survey) {
      // 更新现有记录  
      await survey.update({
        basicInfo,
        weights,
        basicFilter,
        results,
        status: 'submitted'
      }, { transaction });
    } else {
      // 没有草稿的情况下创建新记录  
      survey = await Survey.create({
        userId,
        basicInfo,
        weights,
        basicFilter,
        results,
        status: 'submitted'
      }, { transaction });
    }

    // 更新用户的问卷提交状态  
    await User.update(
      { hasSubmittedSurvey: true },
      {
        where: { id: userId },
        transaction
      }
    );

    await transaction.commit();
    return { survey, results };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 获取已提交的问卷  
export const getSubmittedSurvey = async (userId) => {
  const survey = await Survey.findOne({
    where: {
      userId: userId,
      status: 'submitted'
    },
    order: [['createdAt', 'DESC']]
  });

  return survey;
};

// 计算匹配结果的辅助函数 (私有方法)  
async function calculateResults(userId, basicInfo, weights) {
  // 获取用户池中的用户作为潜在匹配  
  const potentialMatches = await User.findAll({
    where: {
      hasSubmittedSurvey: true,
      id: { [db.Sequelize.Op.ne]: userId }
    },
    limit: 20
  });

  // 计算匹配度 (此处为示例实现)  
  const matches = potentialMatches.map(user => {
    // 实际应用中需要获取用户的问卷数据，进行算法匹配  
    const matchScore = Math.floor(Math.random() * 100);
    return {
      userId: user.id,
      username: user.username,
      nickname: user.nickname || user.username,
      avatar: user.avatar,
      matchScore,
      matchDetails: {
        // 各维度匹配详情  
        partnerPreferences: Math.floor(Math.random() * 100),
        values: Math.floor(Math.random() * 100),
        emotionalPatterns: Math.floor(Math.random() * 100),
        lifestyle: Math.floor(Math.random() * 100),
        futurePlanning: Math.floor(Math.random() * 100)
      }
    };
  });

  // 按匹配度排序  
  matches.sort((a, b) => b.matchScore - a.matchScore);

  return {
    topMatches: matches.slice(0, 5),
    allMatches: matches
  };
}