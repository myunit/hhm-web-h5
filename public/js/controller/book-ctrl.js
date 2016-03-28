/**
 * @author qianqing
 * @create by 16-2-20
 * @description book controller
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

      $(document).on("pageInit", "#page-book-confirm", function (e, id, page) {
        var search = Utils.getSearch(location);
        var selectId = 0;
        var productIdList = [];
        if (search['id']) {
          selectId = parseInt(search['id']);
        }

        if (search['product']) {
          productIdList = search['product'].split('!');
        }

        var vm = new Vue({
          el: '#page-book-confirm',
          data: {
            payment: 0,
            receiver: null,
            cartsAry: [],
            countPrice: 0,
            cartIds: [],
            productIdStr: search['product'],
            promotion: 0
          }
        });

        ajaxPost('/address/get-all-receiver', {}, function (err, data) {
          if (err) {
            $.toast(err, 1000);
          } else {
            var receivers = data.receiver;
            var len = receivers.length;
            var i = 0;
            vm.receiver = {receiverId:0, phone:'', receiver:'', pcdDes:'', address:''};
            if (selectId > 0) {
              for (i = 0; i < len; i++) {
                if (receivers[i].SysNo === selectId) {
                  vm.receiver.receiverId = receivers[i].SysNo;
                  vm.receiver.phone = receivers[i].ReceiverMobile;
                  vm.receiver.receiver = receivers[i].ReceiverName;
                  vm.receiver.pcdDes = receivers[i].Province + ' ' + receivers[i].City + ' ' + receivers[i].District;
                  vm.receiver.address = receivers[i].Address;
                  break;
                }
              }
            } else {
              for (i = 0; i < len; i++) {
                if (receivers[i].IsDefault) {
                  vm.receiver.receiverId = receivers[i].SysNo;
                  vm.receiver.phone = receivers[i].ReceiverMobile;
                  vm.receiver.receiver = receivers[i].ReceiverName;
                  vm.receiver.pcdDes = receivers[i].Province + ' ' + receivers[i].City + ' ' + receivers[i].District;
                  vm.receiver.address = receivers[i].Address;
                  break;
                }
              }
            }

            if (vm.receiver.receiverId === 0 && len > 0) {
              vm.receiver.receiverId = receivers[0].SysNo;
              vm.receiver.phone = receivers[0].ReceiverMobile;
              vm.receiver.receiver = receivers[0].ReceiverName;
              vm.receiver.pcdDes = receivers[0].Province + ' ' + receivers[0].City + ' ' + receivers[0].District;
              vm.receiver.address = receivers[0].Address;
            }
          }
        });

        ajaxPost('/cart/cart-info', {}, function (err, data) {
          if (err) {
            $.toast(err, 1000);
          } else {
            var cart = data.cart;
            var len = cart.length;
            var item = null;
            var cartsObj = {};
            for (var i = 0; i < len; i++) {
              item = cart[i];
              if (productIdList.indexOf(item.ProductSysNo+'') === -1){
                continue;
              }
              var sku = {};
              vm.promotion += item.PromotionAmount;
              if (cartsObj[item.ProductSysNo] === undefined) {
                cartsObj[item.ProductSysNo] = {};
                cartsObj[item.ProductSysNo].name = item.Name;
                cartsObj[item.ProductSysNo].productId = item.ProductSysNo;
                cartsObj[item.ProductSysNo].image = item.Images.length > 0 ? item.Images[0].ImgUrl : '';
                cartsObj[item.ProductSysNo].skus = [];
                cartsObj[item.ProductSysNo].checked = true;
                cartsObj[item.ProductSysNo].stock = item.Stock;
                sku.cartId = item.SysId;
                sku.skuId = item.SkuSysNo;
                sku.size = item.SizeName;
                sku.qty = item.Qty;
                sku.price = item.Price;
                vm.countPrice += sku.price * sku.qty;
                cartsObj[item.ProductSysNo].skus.push(sku);
                vm.cartIds.push(sku.cartId);
              } else {
                sku.cartId = item.SysId;
                sku.skuId = item.SkuSysNo;
                sku.size = item.SizeName;
                sku.qty = item.Qty;
                sku.price = item.Price;
                vm.countPrice += sku.price * sku.qty;
                cartsObj[item.ProductSysNo].skus.push(sku);
                vm.cartIds.push(sku.cartId);
              }
            }

            for (var c in cartsObj) {
              if (cartsObj.hasOwnProperty(c)) {
                vm.cartsAry.push(cartsObj[c]);
              }
            }

            ajaxPost('/cart/user-promotion', {cartIds: JSON.stringify(vm.cartIds)}, function (err, data) {
              $.hidePreloader();
              if (err) {
                $.toast(err, 1000);
              } else {
                vm.promotion += data.promotion;
              }
            });
          }
        });
        $.showPreloader('请稍等...');

        $(page).on('click', '#submitBook', function (event) {
          event.preventDefault();
          ajaxPost('/book/confirm', {
            'receiverId': vm.receiver.receiverId,
            'logistics': '快递',
            'payment': vm.payment,
            'cartIds': JSON.stringify(vm.cartIds)
          }, function (err, data) {
            $.hidePreloader();
            if (err) {
              $.toast(err, 1000);
            } else {
              if (vm.payment === 0) {
                location.href = '/weixin/oauth?orderId=' + data.orderId + '&name=' + vm.receiver.receiver;
                $.showPreloader('准备支付...');
                return;
              }

              if (vm.payment === 4) {
                location.href = '/book/complete';
                return;
              }

            }
          });
          $.showPreloader('提交订单...');
        });
      });

      $(document).on("pageInit", "#page-book-complete", function (e, id, page) {
        var vm = new Vue({
          el: '#page-book-complete',
          data: {}
        });
      });

      $(document).on("pageInit", "#page-book-pay-way", function (e, id, page) {
        var search = Utils.getSearch(location);
        var openId = 0;
        var orderId = 0;
        var userName = '';
        if (!search['openId'] || !search['state']) {
          location.href = '/';
        }
        openId = search['openId'];
        var state = search['state'];
        state = state.split('@');
        orderId = parseInt(state[0]);
        userName = state[1];

        var vm = new Vue({
          el: '#page-book-pay-way',
          data: {
            amount: 0,
            isReady: false
          },
          methods: {
            pay: pay
          }
        });

        function getOrderDetail() {
          ajaxPost('/book/detail', {orderId: orderId}, function (err, data) {
            $.hidePreloader();
            if (err) {
              $.toast(err, 1000);
              //location.href = '/users/my-book'
            } else {
              var order = data.order;
              vm.amount = order.Amount * 100;
              vm.isReady = true;
            }
          });
        }

        getOrderDetail();
        $.showPreloader('请稍等...');

        function onBridgeReady(payargs) {
          WeixinJSBridge.invoke(
            'getBrandWCPayRequest', payargs,
            function (res) {
              if (res.err_msg == "get_brand_wcpay_request:ok") {
                location.href = '/book/complete';
              } else {
                $.toast('支付失败, 请到我的订单重新支付！', 1000);
                setTimeout(function () {
                  location.href = '/users/my-book';
                }, 1000);
              }
            }
          );
        }

        function pay() {
          ajaxPost('/weixin/pay', {
            openId: openId,
            orderId: orderId,
            amount: vm.amount,
            userName: userName
          }, function (err, data) {
            $.hidePreloader();
            if (err) {
              $.toast(err, 1000);
            } else {
              onBridgeReady(data.payargs);
            }
          });
        }

      });

      $(document).on("pageInit", "#page-book-detail", function (e, id, page) {
        var search = Utils.getSearch(location);
        if (!search['id']) {
          location.href = '/';
          return;
        }

        var orderId = parseInt(search['id']);
        var vm = new Vue({
          el: '#page-book-detail',
          data: {
            orderId: orderId,
            order: {}
          },
          methods: {
            payOrder: payOrder,
            cancelOrder: cancelOrder,
            reBuy: reBuy
          }
        });

        function payOrder () {
          location.href = '/weixin/oauth?orderId=' + orderId + '&name=' + vm.order.ReceiverName;
          $.showPreloader('准备支付...');
        }

        function cancelOrder () {
          $.confirm('确定删除该商品吗?',
            function () {
              ajaxPost('/book/cancel', {
                orderId: vm.orderId
              }, function (err, data) {
                $.hidePreloader();
                if (err) {
                  $.toast(err, 1000);
                } else {
                  var order = vm.order;
                  order.Status = "已取消";
                  order.statusNote = "已取消";
                  order.canCancel = false;
                  order.canPay = false;
                  order.reBuy = true;
                }
              });

              $.showPreloader('取消订单');
            },
            function () {

            }
          );
        }

        function reBuy () {

        }

        ajaxPost('/book/detail', {
          orderId: vm.orderId
        }, function (err, data) {
          $.hidePreloader();
          if (err) {
            $.toast(err, 1000);
          } else {
            var order = data.order;
            order.statusNote = '';
            order.canCancel = false;
            order.canPay = false;
            order.reBuy = false;
            order.PCD = order.PCD.replace(/\-/g,' ');
            if (order.Status === '待审核' || order.Status === '待付款') {
              if (!order.PayMent === '货到付款' && order.PayStatus === 'UnPay') {
                order.statusNote = '待付款';
                order.canCancel = true;
                order.canPay = true;
              } else {
                order.statusNote = '待审核';
                order.canCancel = true;
              }
            } else if (order.Status === '待发货' || order.Status === '已发货') {
              order.statusNote = order.Status;
            } else {
              order.statusNote = order.Status;//已发货
              order.reBuy = true;
            }
            vm.order = Utils.clone(order);
          }
        });
        $.showPreloader('请稍等');
      });

      $.init();
    }
  );
}());
