/**
 * @author qianqing
 * @create by 16-3-8
 * @description get pcd code and description
 */
var address = require('./city');
var async = require('async');

var CityChoose = {
  getPCD: function (provinceName, cityName, districtName, callback) {
    if (!provinceName || !cityName || !districtName || !callback) {
      callback('Parameter error', null);
    }
    async.waterfall(
      [
        function (cb) {
          var provinces = address['p'];
          for (var i = 0; i < provinces.length; i++) {
            if (provinces[i].name.indexOf(provinceName) >= 0) {
              cb(null, {province: provinces[i]});
              return;
            }
          }
          cb('can not find ' + provinceName);
        },
        function (pcd, cb) {
          var cities = address['c'][pcd.province.id + ''];
          for (var i = 0; i < cities.length; i++) {
            if (cities[i].name.indexOf(cityName) >= 0) {
              pcd.city = cities[i];
              cb(null, pcd);
              return;
            }
          }
          cb('can not find ' + cityName);
        },
        function (pcd, cb) {
          var districts = address['a'][pcd.city.id + ''];
          for (var i = 0; i < districts.length; i++) {
            if (districts[i].name.indexOf(districtName) >= 0) {
              pcd.district = districts[i];
              cb(null, pcd);
              return;
            }
          }
          cb('can not find ' + districtName);
        }
      ],
      function (err, pcd) {
        callback(err, pcd);
      }
    );
  }
};

exports = module.exports = CityChoose;
