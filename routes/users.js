var express = require('express');
var unirest = require('unirest');
var ApiFactory = require('../common/api_config');
var router = express.Router();

var customerApi = ApiFactory.CreateApi('customer');
var loginApi = ApiFactory.CreateApi('login');

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
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Access-Token': req.session.token})
    .send({"userId": req.session.uid})
    .end(function (response) {
      var data = response.body.repData;
      if (data === undefined) {
        res.json({status: 0, msg: '服务异常'});
      }
      if (data.status) {
        res.json({status: data.status, storeName: data.store.StoreName});
      } else {
        res.json({status: data.status, msg: data.msg});
      }
    });
});

router.post('/setStoreName', function (req, res, next) {
  unirest.post(customerApi.setStoreInfo())
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Access-Token': req.session.token})
    .send({"userId": req.session.uid, "storeName": req.body.storeName})
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

router.get('/account', function (req, res, next) {
  res.render('my-account', {title: '账户管理-好好卖'});
});

router.get('/change-shop-name', function (req, res, next) {
  res.render('change-shop-name', {title: '店铺名称-好好卖'});
});

router.route('/change-password')
  .get(function (req, res, next) {
    res.render('change-password', {title: '修改密码-好好卖'});
  })
  .post(function (req, res, next) {
    unirest.post(loginApi.modifyPassword())
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Access-Token': req.session.token})
      .send({"userId": req.session.uid, "newPassword": req.body.password})
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

router.get('/my-book', function (req, res, next) {
  res.render('my-book', {title: '我的订单-好好卖'});
});

router.get('/buy-report', function (req, res, next) {
  res.render('my-buy-report', {title: '采购报表-好好卖'});
});

router.get('/buy-report-result', function (req, res, next) {
  res.render('my-buy-report-result', {title: '采购报表-好好卖'});
});

router.route('/my-fav')
  .get(function (req, res, next) {
    res.render('my-fav', {title: '我的收藏-好好卖'});
  }).post(function (req, res, next) {
    unirest.post(customerApi.getMyFavorite())
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
      .send({
        "userId": req.session.uid,
        "pageId": req.body.pageId,
        "pageSize": req.body.pageSize
      })
      .end(function (response) {
        var data = response.body.repData;
        if (data === undefined) {
          res.json({status: 0, msg: '服务异常'});
        }
        if (data.status) {
          res.json({status: data.status, count: data.count, favorite: data.favorite});
        } else {
          res.json({status: data.status, msg: data.msg});
        }
      });
  });

router.post('/add-fav', function (req, res, next) {
  unirest.post(customerApi.addFavorite())
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Access-Token': req.session.token})
    .send({"userId": req.session.uid, "productId": req.body.productId})
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

router.post('/del-fav', function (req, res, next) {
  unirest.post(customerApi.delFavorite())
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Access-Token': req.session.token})
    .send({"userId": req.session.uid, "productId": req.body.productId})
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

router.get('/my-message', function (req, res, next) {
  res.render('my-message', {title: '我的消息-好好卖'});
});

router.post('/get-notice-count', function (req, res, next) {
  unirest.post(customerApi.getUnreadNoticeCount())
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

router.get('/my-after-sale', function (req, res, next) {
  res.render('my-after-sale', {title: '售后服务-好好卖'});
});

router.get('/my-address', function (req, res, next) {
  res.render('my-address', {title: '地址管理-好好卖'});
});

module.exports = router;
