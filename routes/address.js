/**
 * @author qianqing
 * @create by 16-2-20
 * @description address route
 */
var express = require('express');
var router = express.Router();

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


module.exports = router;
