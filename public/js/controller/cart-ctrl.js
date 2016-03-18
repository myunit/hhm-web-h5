/**
 * @author qianqing
 * @create by 16-2-19
 * @description cart controller
 */
(function() {
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

          if (!Utils.isPositiveNum(newVal)) {
            $.toast('请输入正确的购买数量', 500);
            Vue.nextTick(function () {
              cartVm.addCartNum1 = oldVal;
            });
          }
        });

        vm.$watch('addCartNum2', function (newVal, oldVal) {
          if (newVal === '') {
            return;
          }

          if (!Utils.isPositiveNum(newVal)) {
            $.toast('请输入正确的购买数量', 500);
            Vue.nextTick(function () {
              cartVm.addCartNum2 = oldVal;
            });
          }
        });

        vm.$watch('addCartNum3', function (newVal, oldVal) {
          if (newVal === '') {
            return;
          }

          if (!Utils.isPositiveNum(newVal)) {
            $.toast('请输入正确的购买数量', 500);
            Vue.nextTick(function () {
              cartVm.addCartNum3 = oldVal;
            });
          }
        });

        vm.$watch('addCartNum4', function (newVal, oldVal) {
          if (newVal === '') {
            return;
          }

          if (!Utils.isPositiveNum(newVal)) {
            $.toast('请输入正确的购买数量', 500);
            Vue.nextTick(function () {
              cartVm.addCartNum4 = oldVal;
            });
          }
        });

        vm.$watch('addCartNum5', function (newVal, oldVal) {
          if (newVal === '') {
            return;
          }

          if (!Utils.isPositiveNum(newVal)) {
            $.toast('请输入正确的购买数量', 500);
            Vue.nextTick(function () {
              cartVm.addCartNum5 = oldVal;
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
}());
