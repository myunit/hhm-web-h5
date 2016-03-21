/**
 * @author qianqing
 * @create by 16-2-19
 * @description cart route
 */
var express = require('express');
var unirest = require('unirest');
var ApiFactory = require('../common/api_config');
var router = express.Router();

var shoppingApi = ApiFactory.CreateApi('shopping');

router.use(function (req, res, next) {
  if (req.session.uid) {
    next();
  } else {
    res.redirect('/');
  }
});

/* GET users listing. */
router.get('/cart', function(req, res, next) {
  res.render('cart', { title: '购物车-好好卖' });
});

router.get('/cart-no-footer', function(req, res, next) {
  res.render('cart-no-footer', { title: '购物车-好好卖' });
});

router.post('/get-count-in-cart', function (req, res, next) {
  unirest.post(shoppingApi.getCountInCart())
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Access-Token': req.session.token})
    .send({"userId": req.session.uid})
    .end(function (response) {
      var data = response.body.repData;
      if (data === undefined) {
        res.json({status: 0, msg: '服务异常'});
      }
      if (data.status) {
        res.json({status: data.status, count: data.count});
      } else {
        res.json({status: data.status, msg: data.msg});
      }
    });
});

module.exports = router;
