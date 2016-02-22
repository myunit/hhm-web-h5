/**
 * @author qianqing
 * @create by 16-2-22
 * @description user controller
 */
require.config({
  baseUrl: '../js',
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

    $(document).on("pageInit", "#page-my", function (e, id, page) {
      var vm = new Vue({
        el: '#page-my',
        data: {
        }
      });

    });

    $(document).on("pageInit", "#page-my-account", function (e, id, page) {
      $("title").text('账户管理');
      var vm = new Vue({
        el: '#page-my-account',
        data: {
        }
      });

      $(page).on('click', '#linkName', function () {
        location.href = '/users/change-shop-name';
      });

      $(page).on('click', '#linkType', function () {
        location.href = '/users/change-shop-style';
      });

      $(page).on('click', '#linkAddress', function () {
        location.href = '/address/manage';
      });
    });

    $(document).on("pageInit", "#page-change-shop-name", function (e, id, page) {
      $("title").text('店铺名称');
      var vm = new Vue({
        el: '#page-change-shop-name',
        data: {
        }
      });

      $(page).on('click', '.button', function () {
        location.href = '/users/account';
      });

    });

    $(document).on("pageInit", "#page-change-shop-style", function (e, id, page) {
      $("title").text('店铺类型');
      var vm = new Vue({
        el: '#page-change-shop-style',
        data: {
        }
      });

      $(page).on('click', 'li a', function () {
        $('li a').removeClass('my-shop-active');
        $(this).addClass('my-shop-active');
        location.href = '/users/account';
      });

    });

    $.init();
  }
);
