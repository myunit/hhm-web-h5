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
  partner: '2088021152272033',

  // 交易安全检验码，由数字和字母组成的32位字符串
  key: 'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAJxonmThKi/v9+YNYRy5edse4xHYETgXIIc3khbcJRsieXKRJuIyMnNS9P2JmUChXuPsdR1OUQ+01TpDoFOcamjeRzqhqRT5yLd1I3EaDY6u7QZnBC08d+GPAqO4+673OcfdEh2K+zPQIsxLOgv5kX28Y+KyCjecbeFNz70PR70hAgMBAAECgYAUX8hqSa5uKis3q3x/+mU2NvLLS0MK9HBHTOTZ13l57Ga3ltLi2jkaLq89K6Rr99ldhVrII4CJtDumaFLFMXXm2QvE3bwT83CgBiQmhWVQ5CEWVFWD6W5j5pHCS50IZJ4JtTFygbjW0K/AypV/qn1t08qsqKRgbmbISvR/JNj69QJBAM8nkIojSsJR1inb8qVs/xX0w9Gtf24OvPm/Dx/j8w76VAuH/1lJBIqu9oooT6w7RFMF79VqnRwZyV273sQhrsMCQQDBSeOP5H+nNYYzQR3pIcv6bbSzoVbnvaL63tuYqb23iS5U2TP1rnM8f9DEJjWSASQskWxM1YxS85qo1aRgy65LAkEAsWUWN9VFHebq2WnK/rK6NtkmH5bNuzfPyKc+knaoHDluY3mQx6rpwsFVyrX+lGUke1xoJ4BnDjte33AUsiyN9QJAfw/dolfperf60nK6AOmQt72qjnM/N/Q30YbzALaE2sQ5StnGCHl3k4vKZ0de6+4II6wtb4zqRBWT0+0ts9vxZQJBAKeAEau8OJEgOYBSK6tz0soMUMViouO7JKcCDkMk3s0OdeqrgK6fuVWAB/KS59rINNGvl5mNrJCfrFyeLfOsEwY=',

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
