/**
 * @author qianqing
 * @create by 16-3-31
 * @description
 */
var express = require('express');
var unirest = require('unirest');
var router = express.Router();

var ApiFactory = require('../common/api_config');
var orderApi = ApiFactory.CreateApi('order');

router.post('/pay-notify-app', function (req, res, next) {
  console.log(JSON.stringify(req));
  res.send();
});

module.exports = router;
