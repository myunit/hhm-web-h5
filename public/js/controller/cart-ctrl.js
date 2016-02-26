/**
 * @author qianqing
 * @create by 16-2-19
 * @description cart controller
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

    $(document).on("pageInit", "#page-cart", function (e, id, page) {
      var vm = new Vue({
        el: '#page-cart',
        data: {
          allChecked: true,
          addCartNum1: 1,
          addCartNum2: 1,
          addCartNum3: 1,
          addCartNum4: 1,
          addCartNum5: 1
        }
      });

      vm.$watch('addCartNum1', function (newVal, oldVal) {
        if (newVal === '') {
          return;
        }

        if (isNaN(newVal) || newVal <= 0) {
          $.toast('只能输入整数', 500);
          Vue.nextTick(function () {
            vm.addCartNum1 = oldVal; // true
          });
        }
      });

      vm.$watch('addCartNum2', function (newVal, oldVal) {
        if (newVal === '') {
          return;
        }

        if (isNaN(newVal) || newVal <= 0) {
          $.toast('只能输入整数', 500);
          Vue.nextTick(function () {
            vm.addCartNum2 = oldVal; // true
          });
        }
      });

      vm.$watch('addCartNum3', function (newVal, oldVal) {
        if (newVal === '') {
          return;
        }

        if (isNaN(newVal) || newVal <= 0) {
          $.toast('只能输入整数', 500);
          Vue.nextTick(function () {
            vm.addCartNum3 = oldVal; // true
          });
        }
      });

      vm.$watch('addCartNum4', function (newVal, oldVal) {
        if (newVal === '') {
          return;
        }

        if (isNaN(newVal) || newVal <= 0) {
          $.toast('只能输入整数', 500);
          Vue.nextTick(function () {
            vm.addCartNum4 = oldVal; // true
          });
        }
      });

      vm.$watch('addCartNum5', function (newVal, oldVal) {
        if (newVal === '') {
          return;
        }

        if (isNaN(newVal) || newVal <= 0) {
          $.toast('只能输入整数', 500);
          Vue.nextTick(function () {
            vm.addCartNum5 = oldVal; // true
          });
        }
      });

      $('.my-list-cart input[type=checkbox]').prop('checked', true);

      $(page).on('click', '.my-nav-bar .label-checkbox', function () {
        if (vm.allChecked) {
          $('.my-list-cart input[type=checkbox]').prop('checked', false);
        } else {
          $('.my-list-cart input[type=checkbox]').prop('checked', true);
        }
      });

      $(page).on('click', '.my-list-cart .label-checkbox', function () {
        if (!$(this).is(":checked")) {
          vm.allChecked = false;
        }
      });

    });

    $.init();
  }
);
