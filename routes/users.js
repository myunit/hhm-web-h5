var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('my', { title: '我的-好好卖' });
});

router.get('/account', function(req, res, next) {
  res.render('my-account', { title: '账户管理-好好卖' });
});

router.get('/change-shop-name', function(req, res, next) {
  res.render('change-shop-name', { title: '店铺名称-好好卖' });
});

router.get('/change-shop-style', function(req, res, next) {
  res.render('change-shop-style', { title: '店铺名称-好好卖' });
});

module.exports = router;
