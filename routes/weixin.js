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

router.get('/code', function (req, res, next) {
  var url = nwo.createURL(wx_conf.appId, wx_conf.authUrl, req.query.productId, 0);
  console.log(url);
  res.redirect(url);
});

router.get('/oauth', function (req, res, next) {
  var app = {
    id: wx_conf.appId,
    secret: wx_conf.secret,
    token: 'weixin'
  };

  nwo.success(app, req.query.code, function(error, body) {
    if (!error) {
      var accessToken = body.acess_token;
      var refreshToken = body.refresh_token;
    }
  });
});

module.exports = router;
