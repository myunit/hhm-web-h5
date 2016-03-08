/**
 * @author qianqing
 * @create by 16-3-8
 * @description
 */
var address = require('./city');

var CityChoose = {
  getPCD: function (provinceName, cityName, districtName) {
    var provinces = address['p'];
    var province = undefined;
    var i = 0;
    for (var i = 0; i < provinces.length; i++) {
      if (provinces[i].name.indexOf(provinceName) >= 0) {
        province = provinces[i];
        break;
      }
    }

    if (province === undefined) {
      return {};
    }

    var cities = address['c'][province.id + ''];
    var city = undefined;
    for (i = 0; i < cities.length; i++) {
      if (cities[i].name.indexOf(cityName) >= 0) {
        city = cities[i];
        break;
      }
    }

    if (city === undefined) {
      return {province: province};
    }

    var districts = address['a'][city.id + ''];
    var district = undefined;
    for (i = 0; i < districts.length; i++) {
      if (districts[i].name.indexOf(districtName) >= 0) {
        district = districts[i];
        break;
      }
    }

    if (district === undefined) {
      return {province: province, city: city};
    }

    return {province: province, city: city, district: district};
  }
};

exports = module.exports = CityChoose;
