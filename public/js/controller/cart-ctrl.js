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
          allChecked: true
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
