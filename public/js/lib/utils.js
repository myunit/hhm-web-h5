/**
 * @author qianqing
 * @create by 16-2-18
 * @description
 */
define(function () {

  var getSearch = function (location) {
    var url = location.search; //获取url中"?"符后的字串
    var searchObj = new Object();
    if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      var strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        searchObj[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }
    }
    return searchObj;
  };


  return {
    getSearch: getSearch
  }
});
