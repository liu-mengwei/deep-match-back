import * as surveyService from '../services/survey.js';

// 获取当前用户的问卷草稿  
export const getSurveyDraft = async (ctx) => {
  try {
    const userId = ctx.state.user.id;
    const draft = await surveyService.getUserDraft(userId);

    if (draft) {
      ctx.body = {
        id: draft.id,
        basicInfo: draft.basicInfo,
        basicFilter: draft.basicFilter,
        weights: draft.weights,
        createdAt: draft.createdAt,
        updatedAt: draft.updatedAt,
        status: draft.status
      };
    } else {
      ctx.body = null;
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: '获取问卷草稿失败', details: error.message };
  }
};

// 保存问卷草稿  
export const saveSurveyDraft = async (ctx) => {
  try {
    const userId = ctx.state.user.id;
    const { basicInfo, weights, basicFilter } = ctx.request.body;

    const draft = await surveyService.saveDraft(userId, basicInfo, weights, basicFilter);

    ctx.body = {
      success: true,
      draft: {
        id: draft.id,
        updatedAt: draft.updatedAt
      }
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: '保存问卷草稿失败', details: error.message };
  }
};

// 更新问卷草稿
export const updateSurveyDraft = async (ctx) => {
  try {
    const userId = ctx.state.user.id;
    const draftData = ctx.request.body;

    const draft = await surveyService.updateDraft(userId, draftData);

    ctx.body = {
      success: true,
      draft: {
        id: draft.id,
        updatedAt: draft.updatedAt
      }
    };
  } catch (error) {
    ctx.status = error.message === '找不到草稿' ? 404 : 500;
    ctx.body = {
      error: '更新问卷草稿失败',
      details: error.message
    };
  }
};

// 删除问卷草稿  
export const deleteSurveyDraft = async (ctx) => {
  try {
    const userId = ctx.state.user.id;
    const deleted = await surveyService.deleteDraft(userId);

    ctx.body = {
      success: true,
      deleted
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: '删除问卷草稿失败', details: error.message };
  }
};

// 获取已提交的问卷  
export const getSubmittedSurvey = async (ctx) => {
  try {
    const userId = ctx.state.user.id;
    const survey = await surveyService.getSubmittedSurvey(userId);

    if (survey) {
      ctx.body = {
        id: survey.id,
        basicInfo: survey.basicInfo,
        basicFilter: survey.basicFilter,
        weights: survey.weights,
        results: survey.results,
        createdAt: survey.createdAt
      };
    } else {
      ctx.status = 404;
      ctx.body = { error: '未找到已提交的问卷' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: '获取已提交问卷失败', details: error.message };
  }
};

// 新增：提交草稿（仅更改状态，不计算结果）
export const submitSurveyDraft = async (ctx) => {
  try {
    const userId = ctx.state.user.id;
    const draft = await surveyService.submitDraft(userId);
    if (!draft) {
      ctx.status = 404;
      ctx.body = { error: '草稿不存在或已提交' };
      return;
    }
    ctx.body = {
      success: true,
      draft: {
        id: draft.id,
        status: draft.status,
        updatedAt: draft.updatedAt
      }
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: '提交草稿失败', details: error.message };
  }
};

// 更新问卷草稿状态
export const updateSurveyDraftStatus = async (ctx) => {
  try {
    const userId = ctx.state.user.id;
    const { status } = ctx.request.body;
    
    // 验证状态参数
    if (!status || !['draft', 'submitted'].includes(status)) {
      ctx.status = 400;
      ctx.body = { error: '无效的状态参数，必须为 draft 或 submitted' };
      return;
    }
    
    const draft = await surveyService.updateDraftStatus(userId, status);
    
    if (!draft) {
      ctx.status = 404;
      ctx.body = { error: '草稿不存在' };
      return;
    }
    
    ctx.body = {
      success: true,
      draft: {
        id: draft.id,
        status: draft.status,
        updatedAt: draft.updatedAt
      }
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: '更新草稿状态失败', details: error.message };
  }
};