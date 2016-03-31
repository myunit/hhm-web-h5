/**
 * @author qianqing
 * @create by 16-3-31
 * @description
 */
var baseConfig = {
  ALIPAY_HOST: 'mapi.alipay.com',
  ALIPAY_PATH: 'gateway.do?',
  ALIPAY_PORT: '443',
  HTTPS_VERIFY_PATH: '/gateway.do?service=notify_verify&',

  // 合作身份者ID，以2088开头由16位纯数字组成的字符串
  partner: '',

  // 交易安全检验码，由数字和字母组成的32位字符串
  key: '',

  // 签约支付宝账号或卖家收款支付宝帐户
  seller_email: '',

  // 支付宝服务器通知的页面 要用 http://格式的完整路径，不允许加?id:123这类自定义参数
  notify_url: 'http://127.0.0.1:3000/notify_page',

  // 当前页面跳转后的页面 要用 http://格式的完整路径，不允许加?id:123这类自定义参数
  return_url: 'http://127.0.0.1:3000/return_page',

  // 字符编码格式 目前支持 gbk 或 utf-8
  input_charset: 'UTF-8',

  // 签名方式 不需修改
  sign_type: 'MD5'
};

module.exports = baseConfig;
