/**
 * @author qianqing
 * @create by 16-2-20
 * @description address route
 */
var express = require('express');
var unirest = require('unirest');
var ApiFactory = require('../common/api_config');
var router = express.Router();
var customerApi = ApiFactory.CreateApi('customer');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('address-select', { title: '选择地址-好好卖' });
});

router.get('/manage', function(req, res, next) {
  res.render('address-select', { title: '地址管理-好好卖' });
});

router.get('/add', function(req, res, next) {
  res.render('address-edit', { title: '新增地址-好好卖' });
});

router.get('/modify', function(req, res, next) {
  res.render('address-edit', { title: '修改地址-好好卖' });
});

router.post('/set-default-receiver', function (req, res, next) {
  unirest.post(customerApi.setDefaultReceiver())
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Access-Token':req.session.token})
    .send({"userId": req.session.uid, "receiverId": req.body.receiverId})
    .end(function (response) {
      var data = response.body.repData;
      if (data === undefined) {
        res.json({status: 0, msg: '服务异常'});
      }
      if (data.status) {
        res.json({status: data.status});
      } else {
        res.json({status: data.status, msg: data.msg});
      }
    });
});

router.post('/get-all-receiver',function (req, res, next) {
  unirest.post(customerApi.getReceiver())
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Access-Token':req.session.token})
    .send({"userId": req.session.uid})
    .end(function (response) {
      var data = response.body.repData;
      if (data === undefined) {
        res.json({status: 0, msg: '服务异常'});
      }
      if (data.status) {
        res.json({status: data.status, receiver: data.receiver});
      } else {
        res.json({status: data.status, msg: data.msg});
      }
    });
});

router.post('/del-receiver', function (req, res, next) {
  unirest.post(customerApi.delReceiver())
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Access-Token':req.session.token})
    .send({"userId": req.session.uid, "receiverId": req.body.receiverId})
    .end(function (response) {
      var data = response.body.repData;
      if (data === undefined) {
        res.json({status: 0, msg: '服务异常'});
      }
      if (data.status) {
        res.json({status: data.status});
      } else {
        res.json({status: data.status, msg: data.msg});
      }
    });
});

module.exports = router;
