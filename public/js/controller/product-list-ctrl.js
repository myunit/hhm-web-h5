/**
 * @author qianqing
 * @create by 16-2-16
 * @description product list controller
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

    $(document).on("pageInit", "#product-list", function(e, id, page) {
      var type = 0;
      if (window.location.pathname === '/product/sales') {
        type = 1;
      } else if (window.location.pathname === '/product/new') {
        type = 2;
      }
      var vm = new Vue({
        el: '#product-list',
        data: {
          type: type
        },
        computed: {
          categoryTitle: function () {
            if (this.type === 1) {
              return '特卖';
            } else if (this.type === 2) {
              return '新品';
            } else {
              return '';
            }
          }
        }
      });


    });

    $.init();
  }
);
