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
  if (req.session && req.session.uid) {
    next();
  } else {
    res.redirect('/');
  }
});

/* GET users listing. */
router.get('/cart', function (req, res, next) {
  res.render('cart', {title: '购物车-好好卖'});
});

router.post('/cart-info', function (req, res, next) {
  unirest.post(shoppingApi.getCartInfo())
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Access-Token': req.session.token})
    .send({"userId": req.session.uid})
    .end(function (response) {
      var error = response.body.error;
      if (error && error.message === 'Authorization Required') {
        res.json({status: -1, msg: '您的登录已过期，请重新登录！'});
        return;
      }
      
      var data = response.body.repData;
      if (data === undefined) {
        res.json({status: 0, msg: '服务异常'});
        return;
      }

      if (data.status) {
        res.json({status: data.status, cart: data.cart});
      } else {
        res.json({status: data.status, msg: data.msg});
      }
    });
});

router.get('/cart-no-footer', function (req, res, next) {
  res.render('cart-no-footer', {title: '购物车-好好卖'});
});

router.post('/get-count-in-cart', function (req, res, next) {
  unirest.post(shoppingApi.getCountInCart())
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Access-Token': req.session.token})
    .send({"userId": req.session.uid})
    .end(function (response) {
      var error = response.body.error;
      if (error && error.message === 'Authorization Required') {
        res.json({status: -1, msg: '您的登录已过期，请重新登录！'});
        return;
      }
      
      var data = response.body.repData;
      if (data === undefined) {
        res.json({status: 0, msg: '服务异常'});
        return;
      }
      if (data.status) {
        res.json({status: data.status, count: data.count});
      } else {
        res.json({status: data.status, msg: data.msg});
      }
    });
});

router.post('/modify-cart-qty', function (req, res, next) {
  unirest.post(shoppingApi.modifyQtyInCart())
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Access-Token': req.session.token})
    .send({"userId": req.session.uid, "cartId": parseInt(req.body.cartId), "qty": parseInt(req.body.qty), "device": ""})
    .end(function (response) {
      var error = response.body.error;
      if (error && error.message === 'Authorization Required') {
        res.json({status: -1, msg: '您的登录已过期，请重新登录！'});
        return;
      }
      
      var data = response.body.repData;
      if (data === undefined) {
        res.json({status: 0, msg: '服务异常'});
        return;
      }
      if (data.status) {
        res.json({status: data.status, msg: data.msg});
      } else {
        res.json({status: data.status, msg: data.msg});
      }
    });
});

router.post('/user-promotion', function (req, res, next) {
  unirest.post(shoppingApi.getUserPromotion())
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Access-Token': req.session.token})
    .send({"userId": req.session.uid, "cartIds": req.body.cartIds})
    .end(function (response) {
      var error = response.body.error;
      if (error && error.message === 'Authorization Required') {
        res.json({status: -1, msg: '您的登录已过期，请重新登录！'});
        return;
      }
      
      var data = response.body.repData;
      if (data === undefined) {
        res.json({status: 0, msg: '服务异常'});
        return;
      }
      if (data.status) {
        res.json({status: data.status, promotion: data.promotion});
      } else {
        res.json({status: data.status, msg: data.msg});
      }
    });
});

router.post('/del-cart', function (req, res, next) {
  unirest.post(shoppingApi.delInCart())
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Access-Token': req.session.token})
    .send({"userId": req.session.uid, "cartId": req.body.cartId})
    .end(function (response) {
      var error = response.body.error;
      if (error && error.message === 'Authorization Required') {
        res.json({status: -1, msg: '您的登录已过期，请重新登录！'});
        return;
      }
      
      var data = response.body.repData;
      if (data === undefined) {
        res.json({status: 0, msg: '服务异常'});
        return;
      }
      if (data.status) {
        res.json({status: data.status, promotionAmount: data.promotionAmount});
      } else {
        res.json({status: data.status, msg: data.msg});
      }
    });
});

router.post('/add-to-cart', function (req, res, next) {
  console.log({
    "userId": req.session.uid,
    "product": [{
      "pId": parseInt(req.body.productId),
      "pItemId": parseInt(req.body.skuId),
      "qty": parseInt(req.body.qty),
      "shoppingSource": ""
    }],
    "device": ""
  });
  unirest.post(shoppingApi.addToCart())
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Access-Token': req.session.token})
    .send({
      "userId": req.session.uid,
      "product": [{
        "pId": parseInt(req.body.productId),
        "pItemId": parseInt(req.body.skuId),
        "qty": parseInt(req.body.qty),
        "shoppingSource": ""
      }],
      "device": ""
    })
    .end(function (response) {
      var error = response.body.error;
      if (error && error.message === 'Authorization Required') {
        res.json({status: -1, msg: '您的登录已过期，请重新登录！'});
        return;
      }
      
      var data = response.body.repData;
      if (data === undefined) {
        res.json({status: 0, msg: '服务异常'});
        return;
      }
      if (data.status) {
        res.json({status: data.status, promotionAmount: data.promotionAmount});
      } else {
        res.json({status: data.status, msg: data.msg});
      }
    });
});

module.exports = router;
