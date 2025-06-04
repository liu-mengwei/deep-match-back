import Core from '@alicloud/pop-core';
import config from '../config/index.js';

class SMSService {
  constructor() {
    // 初始化阿里云SMS客户端  
    this.client = new Core({
      accessKeyId: config.sms.accessKeyId,
      accessKeySecret: config.sms.accessKeySecret,
      endpoint: 'https://dysmsapi.aliyuncs.com',
      apiVersion: '2017-05-25'
    });
  }

  // 发送验证码  
  async sendVerificationCode(phone, code, type) {
    try {
      // 选择对应的短信模板  
      let templateCode;
      switch (type) {
        case 'register':
          templateCode = config.sms.templates.register;
          break;
        case 'login':
          templateCode = config.sms.templates.login;
          break;
        case 'reset_password':
          templateCode = config.sms.templates.resetPassword;
          break;
        default:
          throw new Error('无效的短信类型');
      }

      // 发送参数  
      const params = {
        PhoneNumbers: phone,
        SignName: config.sms.signName,
        TemplateCode: templateCode,
        TemplateParam: JSON.stringify({ code })
      };

      const requestOption = {
        method: 'POST'
      };

      // 实际环境中发送短信  
      if (process.env.NODE_ENV === 'production') {
        const result = await this.client.request('SendSms', params, requestOption);
        console.log('SMS sent:', result);
        return result;
      }

      // 非生产环境模拟发送  
      console.log(`[DEV] 发送短信验证码 ${code} 到 ${phone}`);
      return {
        Code: 'OK',
        Message: 'OK',
        RequestId: 'mock-request-id',
        BizId: `mock-biz-id-${Date.now()}`
      };
    } catch (error) {
      console.error('发送短信失败:', error);
      throw error;
    }
  }
}

export default new SMSService();  