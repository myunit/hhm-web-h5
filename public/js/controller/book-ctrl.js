/**
 * @author qianqing
 * @create by 16-2-20
 * @description book controller
 */
+ function() {
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

      $(document).on("pageInit", "#page-book-confirm", function (e, id, page) {
        var vm = new Vue({
          el: '#page-book-confirm',
          data: {
            payment: 1
          }
        });

        $(page).on('click', '#submitBook', function () {
          if(vm.payment === 1) {
            location.href = '/book/pay-way';
            return;
          }

          if(vm.payment === 2) {
            location.href = '/book/complete';
            return;
          }
        });
      });

      $(document).on("pageInit", "#page-book-complete", function (e, id, page) {
        var vm = new Vue({
          el: '#page-book-complete',
          data: {
          }
        });
      });

      $(document).on("pageInit", "#page-book-pay-way", function (e, id, page) {
        var vm = new Vue({
          el: '#page-book-pay-way',
          data: {
          }
        });
      });

      $(document).on("pageInit", "#page-book-detail", function (e, id, page) {
        var search = Utils.getSearch(location);
        var vm = new Vue({
          el: '#page-book-detail',
          data: {
            type: parseInt(search['status'])
          },
          computed: {
            bookStatus: function () {
              if (this.type === 1) {
                return '待付款';
              } else if (this.type === 2) {
                return '待审核';
              } else if (this.type === 3) {
                return '已完成';
              } else if (this.type === 4) {
                return '已取消';
              } else if (this.type === 5) {
                return '已发货';
              } else if (this.type === 6) {
                return '待发货';
              }
            },
            isNeedPay: function () {
              if (this.type === 1) {
                return true;
              } else {
                return false;
              }
            },
            operateName: function () {
              if (this.type === 1 || this.type === 2) {
                return '取消订单';
              } else if (this.type === 3 || this.type === 4 || this.type === 5) {
                return '再次购买';
              }
            },
            isOperate: function () {
              if (this.type === 6) {
                return false;
              } else {
                return true;
              }
            }
          }
        });
      });

      $.init();
    }
  );
}();
