/**
 * @author qianqing
 * @create by 16-2-19
 * @description cart controller
 */
(function () {
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
        var curQty = 0;
        var vm = new Vue({
          el: '#page-cart',
          data: {
            allChecked: true,
            cartsAry: [],
            cartsObj: {},
            buyList: [],
            total: 0,
            message: 0
          },
          methods: {
            delSku: delSku,
            addQty: addQty,
            subQty: subQty,
            editQty: editQty,
            onFocusNum: onFocusNum,
            submitOrder: submitOrder
          }
        });

        ajaxPost('/users/get-notice-count', {}, function (err, data) {
          if (err) {
          } else {
            vm.message = data.count;
          }
        });

        function computedPrice(buylist) {
          var t = 0;
          var id = 0;
          var skus = null;
          for (var i = 0; i < buylist.length; i++) {
            id = buylist[i];
            skus = vm.cartsObj[id].skus;
            for (var j = 0; j < skus.length; j++) {
              t += skus[j].qty * (skus[j].price*100);
            }
          }
          vm.total = t/100;
        }

        vm.$watch('buyList', function (newVal, oldVal) {
          computedPrice(newVal);
        });

        function submitOrder () {
          if (vm.buyList.length > 0) {
            location.href = '/book/confirm?product=' + vm.buyList.join('!');
          } else {
            $.toast('请先选购商品', 1000);
          }
        }

        function delSku(productId, cartId) {
          $.confirm('确定删除该商品吗?',
            function () {
              ajaxPost('/cart/del-cart', {cartId: cartId}, function (err, data) {
                $.hidePreloader();
                if (err) {
                  $.toast(err, 1000);
                } else {
                  var cartsAry = vm.cartsAry;
                  var len = cartsAry.length;
                  for (var i = 0; i < len; i++) {
                    var cart = cartsAry[i];
                    if (cart.productId === productId) {
                      if (cart.skus.length === 1) {
                        vm.cartsAry.splice(i, 1);
                        delete vm.cartsObj[productId];
                        for (var j = 0; j < vm.buyList.length; j++) {
                          if (productId === vm.buyList[j]) {
                            vm.buyList.splice(j, 1);
                            break;
                          }
                        }
                      } else {
                        for (var s = 0; s < cart.skus.length; s++) {
                          if (cartId === cart.skus[s].cartId) {
                            cart.skus.splice(s, 1);
                            computedPrice(vm.buyList);
                            break;
                          }
                        }
                      }
                      break;
                    }
                  }
                }
              });
              $.showPreloader('请稍等...');
            },
            function () {

            }
          );
        }

        function addQty(productId, cartId) {
          console.log(cartId);
          var product = vm.cartsObj[productId];
          var skus = product.skus;
          var sku = null;
          for (var i = 0; i < skus.length; i++) {
            sku = skus[i];
            if (sku.cartId == cartId) {
              if (sku.qty + 1 > product.stock) {
                $.toast("库存不足！");
                return;
              }
              sku.qty++;
              computedPrice(vm.buyList);
              ajaxPost('/cart/modify-cart-qty', {cartId: cartId, qty: sku.qty}, function (err, data) {
                if (err) {
                  $.toast(err, 1000);
                  sku.qty--;
                  computedPrice(vm.buyList);
                }
              });
              break;
            }
          }
        }

        function subQty(productId, cartId) {
          var product = vm.cartsObj[productId];
          var skus = product.skus;
          var sku = null;
          for (var i = 0; i < skus.length; i++) {
            sku = skus[i];
            if (sku.cartId == cartId) {
              if (sku.qty === 1) {
                return;
              }
              sku.qty--;
              computedPrice(vm.buyList);
              ajaxPost('/cart/modify-cart-qty', {cartId: cartId, qty: sku.qty}, function (err, data) {
                if (err) {
                  $.toast(err, 1000);
                  sku.qty++;
                  computedPrice(vm.buyList);
                }
              });
              break;
            }
          }
        }

        function onFocusNum (qty) {
          curQty = qty;
        }

        function editQty(productId, cartId) {
          var product = vm.cartsObj[productId];
          var skus = product.skus;
          var sku = null;
          for (var i = 0; i < skus.length; i++) {
            sku = skus[i];
            if (sku.cartId == cartId) {
              if (sku.qty === '') {
                sku.qty = curQty;
                computedPrice(vm.buyList);
                return;
              }
              computedPrice(vm.buyList);
              ajaxPost('/cart/modify-cart-qty', {cartId: cartId, qty: sku.qty}, function (err, data) {
                if (err) {
                  $.toast(err, 1000);
                  sku.qty = curQty;
                  computedPrice(vm.buyList);
                }
              });
              break;
            }
          }
        }

        $(page).on('keyup', '.txt-num', function () {
          var val = $(this).val();
          $(this).val(val.replace(/[^\d]/g,''));
        });

        ajaxPost('/cart/cart-info', {}, function (err, data) {
          $.hidePreloader();
          if (err) {
            $.toast(err, 1000);
          } else {
            var cart = data.cart;
            var len = cart.length;
            var item = null;
            for (var i = 0; i < len; i++) {
              item = cart[i];
              var sku = {};
              if (vm.cartsObj[item.ProductSysNo] === undefined) {
                vm.cartsObj[item.ProductSysNo] = {};
                vm.cartsObj[item.ProductSysNo].name = item.Name;
                vm.cartsObj[item.ProductSysNo].productId = item.ProductSysNo;
                vm.cartsObj[item.ProductSysNo].image = item.Images.length > 0 ? item.Images[0].ImgUrl : '';
                vm.cartsObj[item.ProductSysNo].skus = [];
                vm.cartsObj[item.ProductSysNo].checked = true;
                vm.cartsObj[item.ProductSysNo].stock = item.Stock;
                sku.cartId = item.SysId;
                sku.skuId = item.SkuSysNo;
                sku.size = item.SizeName;
                sku.qty = item.Qty;
                sku.price = item.Price;
                vm.cartsObj[item.ProductSysNo].skus.push(sku);
              } else {
                sku.cartId = item.SysId;
                sku.skuId = item.SkuSysNo;
                sku.size = item.SizeName;
                sku.qty = item.Qty;
                sku.price = item.Price;
                vm.cartsObj[item.ProductSysNo].skus.push(sku);
              }
            }

            for (var c in vm.cartsObj) {
              if (vm.cartsObj.hasOwnProperty(c)) {
                vm.cartsAry.push(vm.cartsObj[c]);
                vm.buyList.push(vm.cartsObj[c].productId);
              }
            }

            vm.$nextTick(function () {
              //$('.my-list-cart input[type=checkbox]').prop('checked', true);

              $(page).on('click', '.my-nav-bar .label-checkbox', function (event) {
                if (vm.allChecked) {
                  vm.buyList.splice(0, vm.buyList.length);
                } else {
                  vm.buyList.splice(0, vm.buyList.length);
                  for (var c in vm.cartsObj) {
                    if (vm.cartsObj.hasOwnProperty(c)) {
                      vm.buyList.push(vm.cartsObj[c].productId);
                    }
                  }
                }
              });

              $(page).on('click', '.my-list-cart .label-checkbox', function () {
                if (!$(this).is(":checked")) {
                  vm.allChecked = false;
                }
              });
            });
          }
        });
        $.showPreloader('请稍等...');

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


      });

      $.init();
    }
  );
}());
