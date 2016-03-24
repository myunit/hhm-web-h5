/**
 * @author qianqing
 * @create by 16-3-23
 * @description
 */
var express = require('express');
var unirest = require('unirest');
var router = express.Router();
var nwo = require('node-weixin-oauth');
var wx_conf = require('../weixinPay');
var WXPay = require('weixin-pay');
var path = require('path');
var fs = require('fs');

var wxpay = WXPay({
  appid: wx_conf.appId,
  mch_id: wx_conf.mchId,
  partner_key: wx_conf.apiKey, //微信商户平台API密钥
  pfx: fs.readFileSync(path.resolve('apiclient_cert.p12'))//微信商户平台证书
});

var app = {
  id: wx_conf.appId,
  secret: wx_conf.secret,
  token: 'weixin'
};

router.get('/oauth', function (req, res, next) {
  var url = nwo.createURL(wx_conf.appId, "http://yajore.6655.la/weixin/openId", req.query.orderId, 0);
  res.header('Access-Control-Allow-Origin', '*');
  res.redirect(url);
});

router.get('/openId', function (req, res, next) {
  nwo.success(app, req.query.code, function(error, body) {
    if (!error) {
      res.redirect('/book/pay-way?openId=' + body.openid + '&orderId=' + req.query.state);
    } else {
      res.status(500).send('no openid!');
    }
  });
});

router.post('/pay', function (req, res, next) {
  var params = {
    openid: req.body.openId,
    spbill_create_ip: getClientIp(req),
    notify_url: 'http://yajore.6655.la/weixin/pay-notify',
    body: '好好麦H5支付',
    detail: '公众号支付',
    out_trade_no: req.body.orderId+'T'+Math.random().toString().substr(2, 10),
    total_fee: req.body.amount
  };

  wxpay.getBrandWCPayRequestParams(params, function(err, result){
    // in express
    if (err) {
      res.json({status:0});
    } else {
      res.json({status:1, payargs:result});
    }
  });
});

router.use('/pay-notify', wxpay.useWXCallback(function(msg, req, res, next){
  // 处理商户业务逻辑

  console.log('pay-notify msg: ' + JSON.stringify(msg));
  // res.success() 向微信返回处理成功信息，res.fail()返回失败信息。
  res.success();
}));

function getClientIp(req) {
  var ip =  req.connection.remoteAddress;
  ip = ip.split(':');
  return ip[ip.length-1];
}

module.exports = router;
