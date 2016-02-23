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
        data: {}
      });

    });

    $(document).on("pageInit", "#page-my-account", function (e, id, page) {
      var vm = new Vue({
        el: '#page-my-account',
        data: {}
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

      $(page).on('click', '#linkPassword', function () {
        location.href = '/users/change-password';
      });
    });

    $(document).on("pageInit", "#page-change-shop-name", function (e, id, page) {
      var vm = new Vue({
        el: '#page-change-shop-name',
        data: {}
      });

      $(page).on('click', '.button', function () {
        location.href = '/users/account';
      });

    });

    $(document).on("pageInit", "#page-change-shop-style", function (e, id, page) {
      var vm = new Vue({
        el: '#page-change-shop-style',
        data: {}
      });

      $(page).on('click', 'li a', function () {
        $('li a').removeClass('my-shop-active');
        $(this).addClass('my-shop-active');
        location.href = '/users/account';
      });

    });

    $(document).on("pageInit", "#page-change-password", function (e, id, page) {
      var vm = new Vue({
        el: '#page-change-password',
        data: {
          oldPW: '',
          newPW: '',
          rePW: ''
        },
        computed: {
          isDisable: function () {
            return this.oldPW.length === 0 || this.newPW.length === 0 || this.rePW.length === 0;
          }
        }
      });

      $(page).on('click', '.button', function () {
        if (!vm.oldPW) {
          $.toast("请输入旧密码", 1000);
          return;
        }

        if (!vm.newPW) {
          $.toast("请输入新密码", 1000);
          return;
        }

        if (!vm.rePW) {
          $.toast("请再次输入新密码", 1000);
          return;
        }

        if (vm.isDisable) {
          return;
        }
        $.toast("新密码设置成功！", 1000);
        window.history.back();
      });

    });

    $.init();
  }
);
