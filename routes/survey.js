import { authenticate } from '../middlewares/auth.js';
import Router from 'koa-router';

import {
  getSurveyDraft,
  saveSurveyDraft,
  updateSurveyDraft,
  deleteSurveyDraft,
  submitSurvey,
  getSubmittedSurvey
} from '../controllers/survey.js';

const router = new Router();

// 所有问卷相关接口都需要登录  
router.use(authenticate);

// 问卷草稿相关  
router.get('/draft', getSurveyDraft);
router.post('/draft', saveSurveyDraft);
router.put('/draft', updateSurveyDraft);
router.delete('/draft', deleteSurveyDraft);

// 问卷提交相关  
router.post('/submit', submitSurvey);
router.get('/result', getSubmittedSurvey);

export default router;