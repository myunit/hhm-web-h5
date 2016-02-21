var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: '登录-好好卖' });
});

router.get('/index', function(req, res, next) {
  res.render('index', { title: '首页-好好卖' });
});

module.exports = router;
