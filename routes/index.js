var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: '登录-好好卖' });
});

router.get('/choose-shop-style', function(req, res, next) {
  res.render('choose-shop-style', { title: '完善店铺类型-好好卖' });
});

router.get('/index', function(req, res, next) {
  res.render('index', { title: '首页-好好卖' });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: '注册-好好卖' });
});

router.get('/register-complete', function(req, res, next) {
  res.render('register-complete', { title: '信息完善-好好卖' });
});

module.exports = router;
