var express = require('express');
var unirest = require('unirest');
var ApiFactory = require('../common/api_config');
var router = express.Router();

var customerApi = ApiFactory.CreateApi('customer');

/* GET users listing. */
router.use(function (req, res, next) {
  if (req.session.uid) {
    next();
  } else {
    res.redirect('/');
  }
});

router.get('/', function (req, res, next) {
    res.render('my', {title: '我的-好好卖'});
});

router.post('/getStoreName', function (req, res, next) {
    unirest.post(customerApi.getStoreInfo())
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
      .send({"userId": req.session.uid})
      .end(function (response) {
        var data = response.body.repData;
        if (data.status) {
          res.json({status: data.status, storeName: data.store.StoreName});
        } else {
          res.json({status: data.status, msg: data.msg});
        }
      });
  });

router.get('/account', function (req, res, next) {
  res.render('my-account', {title: '账户管理-好好卖'});
});

router.get('/change-shop-name', function (req, res, next) {
  res.render('change-shop-name', {title: '店铺名称-好好卖'});
});

router.get('/change-shop-style', function (req, res, next) {
  res.render('change-shop-style', {title: '店铺名称-好好卖'});
});

router.get('/change-password', function (req, res, next) {
  res.render('change-password', {title: '修改密码-好好卖'});
});

router.get('/my-book', function (req, res, next) {
  res.render('my-book', {title: '我的订单-好好卖'});
});

router.get('/buy-report', function (req, res, next) {
  res.render('my-buy-report', {title: '采购报表-好好卖'});
});

router.get('/buy-report-result', function (req, res, next) {
  res.render('my-buy-report-result', {title: '采购报表-好好卖'});
});

router.get('/my-fav', function (req, res, next) {
  res.render('my-fav', {title: '我的收藏-好好卖'});
});

router.get('/my-message', function (req, res, next) {
  res.render('my-message', {title: '我的消息-好好卖'});
});

router.get('/my-after-sale', function (req, res, next) {
  res.render('my-after-sale', {title: '售后服务-好好卖'});
});

router.get('/my-address', function (req, res, next) {
  res.render('my-address', {title: '地址管理-好好卖'});
});

module.exports = router;
