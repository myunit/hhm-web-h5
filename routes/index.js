var express = require('express');
var unirest = require('unirest');
var ApiFactory = require('../common/api_config');
var router = express.Router();

var loginApi = ApiFactory.CreateApi('login');

/* GET home page. */
router.route('/')
  .get(function (req, res, next) {
    res.render('login', {title: '登录-好好卖'});
  })
  .post(function (req, res, next) {
    unirest.post(loginApi.login())
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
      .send({"phone": req.body.username, "password": req.body.password})
      .end(function (response) {
        var data = response.body.repData;
        if (data.status) {
          req.session.uid = data.customer.SysNo;
          req.session.token = data.token;
          res.json({status: data.status, redirect: '/index'});
        } else {
          res.json({status: data.status, msg: data.msg});
        }
      });
  });


router.get('/choose-shop-style', function (req, res, next) {
  res.render('choose-shop-style', {title: '完善店铺类型-好好卖'});
});

router.get('/index', function (req, res, next) {
  console.log('req.session.uid:' + req.session.uid);
  if (req.session.uid) {
    res.render('index', {title: '首页-好好卖'});
  } else {
    res.redirect('/');
  }

});

router.get('/register', function (req, res, next) {
  res.render('register', {title: '注册-好好卖'});
});

router.get('/register-complete', function (req, res, next) {
  res.render('register-complete', {title: '信息完善-好好卖'});
});

router.get('/rest-password', function (req, res, next) {
  res.render('rest-password', {title: '重置密码-好好卖'});
});

module.exports = router;
