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

  function ajaxPost(url, data, cb) {
    $.ajax({
      type: 'POST',
      url: url,
      data: data,
      timeout: 15000,
      success: function (data, status, xhr) {
        if (data.status) {
          cb(null, data);
        } else {
          cb(data.msg, null);
        }
      },
      error: function (xhr, errorType, error) {
        console.error(url + ' error: ' + errorType + '##' + error);
        cb('服务异常', null);
      }
    });
  }


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
            carts: {}
          }
        });

        ajaxPost('/cart/cart-info', {}, function (err, data) {
          if (err) {
            $.toast(err, 1000);
          } else {
            var cart = data.cart;
            var len = cart.length;
            var item = null;
            for (var i = 0; i < len; i++) {
              item = cart[i];
              var sku = {};
              if (vm.carts[item.ProductSysNo] === undefined) {
                vm.carts[item.ProductSysNo] = {};
                vm.carts[item.ProductSysNo].name = item.Name;
                vm.carts[item.ProductSysNo].productId = item.ProductSysNo;
                vm.carts[item.ProductSysNo].image = item.Images.length > 0 ? item.Images[0]:'';
                vm.carts[item.ProductSysNo].skus = [];
                sku.cartId = item.SysId;
                sku.skuId = item.SkuSysNo;
                sku.size = item.SizeName;
                sku.qty = item.Qty;
                sku.price = item.Price;
                vm.carts[item.ProductSysNo].skus.push(sku);
              } else {
                sku.cartId = item.SysId;
                sku.skuId = item.SkuSysNo;
                sku.size = item.SizeName;
                sku.qty = item.Qty;
                sku.price = item.Price;
                vm.carts[item.ProductSysNo].skus.push(sku);
              }
            }
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
