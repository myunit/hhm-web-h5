/**
 * @author qianqing
 * @create by 16-2-16
 * @description product list controller
 */
require.config({
  baseUrl: '../js',
  paths: {
    'Vue': './lib/vue.min',
    'Utils': './lib/utils'
  },
  shim: {
    'Vue': {
      exports: 'Vue'
    },
    'Utils': {
      exports: 'Utils'
    }
  }
});

require(['Vue', 'Utils'],
  function (Vue, Utils) {
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
      } else if (window.location.pathname === '/product/recommend') {
        type = 4;
        var searchObj = Utils.getSearch(window.location);
        console.log('searchObj: ' + JSON.stringify(searchObj));
      }

      var vm = new Vue({
        el: '#product-list',
        data: {
          type: type,
          search: ''
        },
        computed: {
          categoryTitle: function () {
            if (this.type === 1) {
              return '特卖';
            } else if (this.type === 2) {
              return '新品';
            } else if (this.type === 3) {
              return '组合商品';
            } else if (this.type === 4) {
              return '推荐商品';
            } else {
              return '商品列表';
            }
          }
        }
      });

      $(page).on('click','.icon-clear', function () {
        vm.search = '';
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

    $(document).on('click','.my-ul-spec li', function () {
      $('.my-ul-spec li').removeClass('my-spec-on');
      $(this).addClass('my-spec-on');
    });

    $.init();
  }
);
