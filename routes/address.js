/**
 * @author qianqing
 * @create by 16-2-20
 * @description address route
 */
var express = require('express');
var unirest = require('unirest');
var ApiFactory = require('../common/api_config');
var CityChoose = require('../common/city_choose');
var router = express.Router();
var customerApi = ApiFactory.CreateApi('customer');

router.use(function (req, res, next) {
  if (req.session.uid) {
    next();
  } else {
    res.redirect('/');
  }
});


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

router.post('/set-default-receiver', function (req, res, next) {
  unirest.post(customerApi.setDefaultReceiver())
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Access-Token':req.session.token})
    .send({"userId": req.session.uid, "receiverId": req.body.receiverId})
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

router.post('/get-all-receiver',function (req, res, next) {
  var obj = {"userId": req.session.uid};
  if (req.body.receiverId) {
    obj.receiverId = parseInt(req.body.receiverId);
  }
  unirest.post(customerApi.getReceiver())
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Access-Token':req.session.token})
    .send(obj)
    .end(function (response) {
      var data = response.body.repData;
      if (data === undefined) {
        res.json({status: 0, msg: '服务异常'});
        return;
      }
      if (data.status) {
        res.json({status: data.status, receiver: data.receiver});
      } else {
        res.json({status: data.status, msg: data.msg});
      }
    });
});

router.post('/del-receiver', function (req, res, next) {
  unirest.post(customerApi.delReceiver())
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Access-Token':req.session.token})
    .send({"userId": req.session.uid, "receiverId": req.body.receiverId})
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

router.post('/modify-receiver', function (req, res, next) {
  function callback (err, pcd) {
    if (err) {
      console.error('get pcd error: ' + err);
      res.json({status: 0, msg: err});
      return;
    }

    unirest.post(customerApi.modifyReceiver())
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Access-Token':req.session.token})
      .send({
        "userId": req.session.uid,
        "receiverId": req.body.receiverId,
        "name": req.body.receiver,
        "phone": req.body.phone,
        "provinceId": pcd.province.id,
        "province": pcd.province.name,
        "cityId": pcd.city.id,
        "city": pcd.city.name,
        "districtId": pcd.district.id,
        "district": pcd.district.name,
        "address": req.body.address,
        "isDefault": req.body.isDefault
      })
      .end(function (response) {
        var data = response.body.repData;
        console.log('data: ' + JSON.stringify(data));
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
  }

  var pcdDes = req.body.pcdDes.split(' ');
  CityChoose.getPCD(pcdDes[0], pcdDes[1], pcdDes[2], callback);

});

router.post('/add-receiver', function (req, res, next) {
  function callback (err, pcd) {
    if (err) {
      console.error('get pcd error: ' + err);
      res.json({status: 0, msg: err});
      return;
    }

    unirest.post(customerApi.addReceiver())
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Access-Token':req.session.token})
      .send({
        "userId": req.session.uid,
        "receiverId": req.body.receiverId,
        "name": req.body.receiver,
        "phone": req.body.phone,
        "provinceId": pcd.province.id,
        "province": pcd.province.name,
        "cityId": pcd.city.id,
        "city": pcd.city.name,
        "districtId": pcd.district.id,
        "district": pcd.district.name,
        "address": req.body.address,
        "isDefault": req.body.isDefault
      })
      .end(function (response) {
        var data = response.body.repData;
        console.log('data: ' + JSON.stringify(data));
        if (data === undefined) {
          res.json({status: 0, msg: '服务异常'});
          return;
        }
        if (data.status) {
          res.json({status: data.status, receiverId: data.receiverId});
        } else {
          res.json({status: data.status, msg: data.msg});
        }
      });
  }

  var pcdDes = req.body.pcdDes.split(' ');
  CityChoose.getPCD(pcdDes[0], pcdDes[1], pcdDes[2], callback);

});

module.exports = router;
