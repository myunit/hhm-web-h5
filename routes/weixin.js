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
var nodeWeixinPay = require('node-weixin-pay');
var nodeWeixinConfig = require('node-weixin-config');

var app = {
  id: wx_conf.appId,
  secret: wx_conf.secret,
  token: 'weixin'
};

var merchant = {
  id: wx_conf.mchId,
  key: wx_conf.mchKey
};

var config = {
  app: app,
  merchant: merchant
};

nodeWeixinConfig.app.init(app);
nodeWeixinConfig.merchant.init(merchant);

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
  var params = { openid: req.body.openId,
    spbill_create_ip: getClientIp(req),
    notify_url: 'http://yajore.6655.la/weixin/payres',
    body: '好好麦H5支付',
    out_trade_no: req.body.orderId,
    total_fee: req.body.amount,
    trade_type: 'JSAPI',
    appid: app.id,
    mch_id: merchant.id,
    nonce_str: 'XjUw56N8MjeCUqHCwqgiKwr2CJVgYUpe' };

  var sign = nodeWeixinPay.sign(merchant, params);
  var id = 'id';
  var config = nodeWeixinPay.prepay(app, merchant, id);
  nodeWeixinPay.api.order.unified(config, params, function(error, data) {
    if (error) {
      console.log('nodeWeixinPay error: ' + error);
      console.log('nodeWeixinPay data: ' + JSON.stringify(data));
    } else {
      console.log('nodeWeixinPay error: ' + error);
      console.log('nodeWeixinPay data: ' + JSON.stringify(data));
    }
  });
  res.json({status:1});
});

router.get('/payres', function (req, res, next) {
  console.log(JSON.stringify(req.body));
  console.log(JSON.stringify(req.query));
});

function getClientIp(req) {
  var ip =  req.connection.remoteAddress;
  ip = ip.split(':');
  return ip[ip.length-1];
}

module.exports = router;
