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

    $(document).on("pageInit", "#page-index", function (e, id, page) {
      $("title").text('首页');
      var vm = new Vue({
        el: '#page-index',
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

    $(document).on("pageInit", "#page-login", function (e, id, page) {
      var vm = new Vue({
        el: '#page-login',
        data: {
          phone: '',
          password: ''
        },
        computed: {
          'isDisable': function () {
            return !(this.phone.length && this.password.length);
          }
        }
      });

      $(page).on('click', '#login', function () {
        if (!vm.isDisable) {
          $.router.load('/choose-shop-style');
        }
      });
    });

    $(document).on("pageInit", "#page-choose-shop-style", function (e, id, page) {
      $("title").text('完善店铺类型');
      var vm = new Vue({
        el: '#page-choose-shop-style',
        data: {
        }
      });
    });

    $(document).on("pageInit", "#page-register", function (e, id, page) {
      $("title").text('注册');
      var vm = new Vue({
        el: '#page-register',
        data: {
          captchaTip: '获取验证码',
          isSendCaptcha: false,
          isDisable: true
        }
      });

      $(page).on('click', '#sendCaptcha', function () {
        var time = 60;
        vm.captchaTip = time + '秒';
        vm.isSendCaptcha = true;
        vm.isDisable = false;
        var sendCaptchaInterval = setInterval(function () {
          time--;
          if(time > 9) {
            vm.captchaTip = time + '秒';
          } else {
            vm.captchaTip = '0' + time + '秒';
          }
          if (time === 0) {
            vm.captchaTip = '获取验证码';
            vm.isSendCaptcha = false;
            vm.isDisable = true;
            clearInterval(sendCaptchaInterval);
          }
        }, 1000);
      });
    });

    $.init();
  }
);
