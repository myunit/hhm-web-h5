/**
 * @author qianqing
 * @create by 16-2-15
 * @description index page controller
 */
require.config({
  baseUrl: './js',
  paths: {
    'Vue': './lib/vue.min'
  },
  shim: {
    'Vue': {
      exports: 'Vue'
    }
  }
});

require(['Vue'],
  function (Vue) {
    'use strict';
    Vue.config.delimiters = ['${', '}'];
    Vue.config.unsafeDelimiters = ['{!!', '!!}'];

    $(document).on("pageInit", "#index-page", function (e, id, page) {
      var vm = new Vue({
        el: '#index-page',
        data: {
          search: '',
          hour: '02',
          min: '00',
          sec: '00'
        }
      });

      var time = 2 * 3600 * 1000;


      var killInterval = setInterval(function () {
        var hour = Math.floor((time % 86400000) / 3600000);
        var min = Math.floor(((time % 86400000) % 3600000) / 60000);
        var sec = Math.floor(((time % 86400000) % 3600000 % 60000) / 1000)
        vm.hour = hour > 9 ? hour : '0' + hour;
        vm.min = min > 9 ? min : '0' + min;
        vm.sec = sec > 9 ? sec : '0' + sec;

        if (hour === 0 && min === 0 && sec === 0) {
          clearInterval(killInterval);
        } else {
          time -= 1000;
        }
      }, 1000);

      $(page).on('click', '.icon-clear', function () {
        vm.search = '';
      });

      $(function () {
        $(".swiper-container").swiper({
          spaceBetween: 30,
          continuous: true,
          autoplay: 2500,
          autoplayDisableOnInteraction: false
        });
      });
    });

    $.init();
  }
);
