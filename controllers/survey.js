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

// 提交问卷  
export const submitSurvey = async (ctx) => {
  try {
    const userId = ctx.state.user.id;
    const { basicInfo, weights, basicFilter } = ctx.request.body;

    // 参数验证  
    if (!basicInfo || Object.keys(basicInfo).length === 0) {
      ctx.status = 400;
      ctx.body = { error: '问卷答案不能为空' };
      return;
    }

    const { survey, results } = await surveyService.submitSurvey(userId, basicInfo, weights, basicFilter);

    ctx.body = {
      success: true,
      survey: {
        id: survey.id,
        results
      }
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: '提交问卷失败', details: error.message };
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