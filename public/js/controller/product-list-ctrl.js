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
      } else if (window.location.pathname === '/product/group') {
        type = 3;
      }
      var vm = new Vue({
        el: '#product-list',
        data: {
          type: type,
          search: '',
          addCartNum: 1
        },
        computed: {
          categoryTitle: function () {
            if (this.type === 1) {
              return '特卖';
            } else if (this.type === 2) {
              return '新品';
            } else if (this.type === 3) {
              return '组合商品';
            } else {
              return '';
            }
          }
        }
      });

      $(page).on('click','.icon-clear', function () {
        vm.search = '';
      });

      $(page).on('click','.em-op-d', function () {
        vm.addCartNum--;
      });

      $(page).on('click','.em-op-a', function () {
        vm.addCartNum++;
      });

    });

    var cartVm = new Vue({
      el: '#popup-cart',
      data: {
        addCartNum: 1
      }
    });

    $(document).on('click','.em-op-d', function () {
      if (cartVm.addCartNum > 1) {
        cartVm.addCartNum--;
      }
    });

    $(document).on('click','.em-op-a', function () {
      cartVm.addCartNum++;
    });

    $.init();
  }
);
