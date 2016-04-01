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
  partner: '2088121867339374',

  // 交易安全检验码，由数字和字母组成的32位字符串
  key: 'MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAMUjhy2CaqQBVyn9qGjVj35JAkpmrhxEysBS0c36h/gKksQtTV/EK+PZWuV7Dv55t3nQSy0sIntyYM8VNl7ykuegYO6uR1mMEO9Lh+AIybJ31TDoY7ChQij9OoNFRZ+swqryWlmgqBYH+hkaD7QhLz7H8umjBzSo3/3mhMgZ8PhtAgMBAAECgYEAsdw0AaNAg2eSNJhecPb813sXTfkF7QtDwfD2yVfXhLpFYClfPZ/H2XIoyBIWnRFDr+t1Z/QByE6ReUQyIcfJMQsZfYhqZer4Rmwcbe50vNxuEY7Fbe88iz9DO/Jta/cAgFSoUDBHdptXPzp+OvHSazATx1+9ax8hTWuNjrbvIiECQQDvZQcjmzrcgIC2iXiZg0Sf/MDZ+i+SorIG3fpZDd6WikuauK0t2+ySkqBHquc8Qmp/BPCft1oJjFq8FUHhiCybAkEA0tAn0bZqCDUWwklHoCus15/9E3k1dagLOcVmpHqt6d2paG10ge9tTL/+BvLbTYoXx/JomOMd77voqR+2I1wLlwJBAKzbzE3flp8FgutLVHO0n2bOgQpkZtmA9P+UZWLMav9UmMb9tr64YJhtm6JkO1f9tRxGmuEY6cCfQh0xVELfqyUCQFpLzHJ4BqyjSK9JQgOqEWt+XKEFrs9Jfh1tnwxee7WLOy++ikPJcPCJ393MEgEBYDRFcWXjCgSQYRRnv9UfbNsCQQDi7k3fmr80EKuRINyLGBPHVVdTlyYik0zAPrqDPF1uUhqoTkTd8SBKzHDmV55Gm2WjtweoiHqMkpdZ+b7fhTgc',

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
