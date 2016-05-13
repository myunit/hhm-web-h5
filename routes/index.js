var express = require('express');
var unirest = require('unirest');
var ApiFactory = require('../common/api_config');
var CityChoose = require('../common/city_choose');
var router = express.Router();

var loginApi = ApiFactory.CreateApi('login');
var customerApi = ApiFactory.CreateApi('customer');
var productApi = ApiFactory.CreateApi('product');

/* GET home page. */
router.route('/')
  .get(function (req, res, next) {
    if (req.session && req.session.uid) {
      res.redirect('/index');
    } else {
      res.render('login', {title: '登录-好好卖'});
    }
  })
  .post(function (req, res, next) {
    unirest.post(loginApi.login())
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
      .send({"phone": req.body.username, "password": req.body.password})
      .end(function (response) {
        var data = response.body.repData;
        if (data === undefined) {
          res.json({status: 0, msg: '服务异常'});
          return;
        }
        if (data.status) {
          req.session.uid = data.customer.SysNo;
          req.session.token = data.token.id;
          res.json({status: data.status, redirect: '/index'});
        } else {
          res.json({status: data.status, msg: data.msg});
        }
      });
  });


router.get('/choose-shop-style', function (req, res, next) {
  res.render('choose-shop-style', {title: '完善店铺类型-好好卖'});
});

router.get('/logout', function (req, res, next) {
  if (req.session && req.session.uid) {
    delete req.session.uid;
    delete req.session.token;
  }
  res.redirect('/');
});

router.get('/index', function (req, res, next) {
  if (req.session && req.session.uid) {
    res.render('index', {title: '首页-好好卖'});
  } else {
    res.redirect('/');
  }
});

router.route('/register')
  .get(function (req, res, next) {
    res.render('register', {title: '注册-好好卖'});
  })
  .post(function (req, res, next) {
    unirest.post(loginApi.registerAndLogin())
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
      .send({"phone": req.body.phone, "password": req.body.password, "code": req.body.captcha, "inviteCode": req.body.inviteCode})
      .end(function (response) {
        var data = response.body.repData;
        if (data === undefined) {
          res.json({status: 0, msg: '服务异常'});
          return;
        }
        if (data.status) {
          req.session.uid = data.customer.SysNo;
          req.session.token = data.token;
          res.json({status: data.status, redirect: '/register-complete'});
        } else {
          res.json({status: data.status, msg: data.msg});
        }
      });
  });

router.post('/is-registered', function (req, res, next) {
  unirest.post(loginApi.isRegistered())
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
    .send({"phone": req.body.phone})
    .end(function (response) {
      var data = response.body.repData;
      if (data === undefined) {
        res.json({status: 0, msg: '服务异常'});
        return;
      }
      if (data.status) {
        res.json({status: data.status, isRegistered: data.isRegistered});
      } else {
        res.json({status: data.status, msg: data.msg});
      }
    });
});

router.post('/get-captcha', function (req, res, next) {
  unirest.post(loginApi.getCaptcha())
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
    .send({"phone": req.body.phone, "type": req.body.type})
    .end(function (response) {
      var data = response.body.repData;
      if (data === undefined) {
        res.json({status: 0, msg: '服务异常'});
        return;
      }
      if (data.status) {
        res.json({status: data.status});
      } else {
        res.json({status: data.status, msg: data.msg});
      }
    });
});

router.route('/register-complete')
  .get(function (req, res, next) {
    if (req.session && req.session.uid) {
      res.render('register-complete', {title: '信息完善-好好卖'});
    } else {
      res.redirect('/');
    }
  })
  .post(function (req, res, next) {
    var pcdCode = req.body['pcdCode[]'];
    var pcdName = req.body['pcdName[]'];
    unirest.post(customerApi.perfectCustomerInfo())
      .headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Access-Token': req.session.token
      })
      .send({
        "userId": req.session.uid, "storeName": req.body.storeName,
        "receiver": {
          "name": req.body.receiver,
          "phone": req.body.phone,
          "provinceId": pcdCode[0],
          "province": pcdName[0],
          "cityId": pcdCode[1],
          "city": pcdName[1],
          "districtId": pcdCode[2],
          "district": pcdName[2],
          "street": req.body.street,
          "streetId": parseInt(req.body.streetId),
          "address": req.body.address
        }
      })
      .end(function (response) {
        var data = response.body.repData;
        if (data === undefined) {
          res.json({status: 0, msg: '服务异常'});
          return;
        }
        if (data.status) {
          res.json({status: data.status, redirect: '/index'});
        } else {
          res.json({status: data.status, msg: data.msg});
        }
      });

  });

router.route('/rest-password')
  .get(function (req, res, next) {
    res.render('rest-password', {title: '重置密码-好好卖'});
  })
  .post(function (req, res, next) {
    unirest.post(loginApi.forgetPassword())
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
      .send({"phone": req.body.phone, "newPassword": req.body.password, "code": req.body.captcha})
      .end(function (response) {
        var data = response.body.repData;
        if (data === undefined) {
          res.json({status: 0, msg: '服务异常'});
          return;
        }
        if (data.status) {
          req.session = null;
          res.json({status: data.status, redirect: '/'});
        } else {
          res.json({status: data.status, msg: data.msg});
        }
      });
  });

router.post('/get-home', function (req, res, next) {
  unirest.post(productApi.getHome())
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Access-Token': req.session.token})
    .send({"userId": req.session.uid, "project": 'hhm'})
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
        res.json({status: data.status, home: data.home});
      } else {
        res.json({status: data.status, msg: data.msg});
      }
    });
});

module.exports = router;
