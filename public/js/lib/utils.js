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

  var isWeiXin = function (navigator) {
    var ua = navigator.userAgent.toLowerCase();
    return ua.indexOf('micromessenger') != -1;
  };

  // dateFormatFormat(new Date(), "yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
  // dateFormatFormat(new Date(), "yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
  var dateFormat = function (date, fmt)
  {
    var o = {
      "M+" : date.getMonth()+1,                 //月份
      "d+" : date.getDate(),                    //日
      "h+" : date.getHours(),                   //小时
      "m+" : date.getMinutes(),                 //分
      "s+" : date.getSeconds(),                 //秒
      "q+" : Math.floor((date.getMonth()+3)/3), //季度
      "S"  : date.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
      fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
      if(new RegExp("("+ k +")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
  };


  return {
    getSearch: getSearch,
    isWeiXin: isWeiXin,
    dateFormat: dateFormat
  }
});
