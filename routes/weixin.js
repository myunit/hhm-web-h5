/**
 * @author qianqing
 * @create by 16-3-23
 * @description
 */
var express = require('express');
var unirest = require('unirest');
var router = express.Router();
var nwo = require('node-weixin-oauth');
var wx_conf = require('../weixinPay.json');

router.get('/code', function (req, res, next) {
  var url = nwo.createURL(wx_conf.appId, 'http://qianqing.site//weixin/oauth', req.query.productId, 0);
  console.log(url);
  res.redirect(url);
});

router.get('/oauth', function (req, res, next) {
  nwo.success(app, code, function(error, body) {
    if (!error) {
      console.log(JSON.stringify(body));
      var accessToken = body.acess_token;
      var refreshToken = body.refresh_token;
      var openId = body.openid;
    }
  });
});

module.exports = router;
