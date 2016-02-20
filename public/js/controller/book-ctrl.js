/**
 * @author qianqing
 * @create by 16-2-20
 * @description book controller
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

    $(document).on("pageInit", "#book-confirm", function (e, id, page) {
      var vm = new Vue({
        el: '#book-confirm',
        data: {
          payment: 1
        }
      });

      $(page).on('click', '#submitBook', function () {
        if(vm.payment === 1) {
          $.router.load('/book/pay-way');
          return;
        }

        if(vm.payment === 2) {
          $.router.load('/book/complete');
          return;
        }
      });
    });

    $(document).on("pageInit", "#book-complete", function (e, id, page) {
      var vm = new Vue({
        el: '#book-complete',
        data: {
        }
      });
    });

    $(document).on("pageInit", "#book-pay-way", function (e, id, page) {
      var vm = new Vue({
        el: '#book-pay-way',
        data: {
        }
      });
    });

    $.init();
  }
);
