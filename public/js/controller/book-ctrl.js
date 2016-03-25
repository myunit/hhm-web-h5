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
        if (search['id']) {
          selectId = parseInt(search['id']);
        }

        var vm = new Vue({
          el: '#page-book-confirm',
          data: {
            payment: 0,
            receiver: null,
            cartsAry: [],
            countPrice: 0,
            cartIds: []
          }
        });

        ajaxPost('/address/get-all-receiver', {}, function (err, data) {
          if (err) {
            $.toast(err, 1000);
          } else {
            var receivers = data.receiver;
            var len = receivers.length;
            var i = 0;
            if (selectId > 0) {
              for (i = 0; i < len; i++) {
                if (receivers[i].SysNo === selectId) {
                  vm.receiver = {};
                  vm.receiver.receiverId = receivers[i].SysNo;
                  vm.receiver.phone = receivers[i].ReceiverPhone;
                  vm.receiver.receiver = receivers[i].ReceiverName;
                  vm.receiver.pcdDes = receivers[i].Province + ' ' + receivers[i].City + ' ' + receivers[i].District;
                  vm.receiver.address = receivers[i].Address;
                  break;
                }
              }
            } else {
              for (i = 0; i < len; i++) {
                if (receivers[i].IsDefault) {
                  vm.receiver = {};
                  vm.receiver.receiverId = receivers[i].SysNo;
                  vm.receiver.phone = receivers[i].ReceiverPhone;
                  vm.receiver.receiver = receivers[i].ReceiverName;
                  vm.receiver.pcdDes = receivers[i].Province + ' ' + receivers[i].City + ' ' + receivers[i].District;
                  vm.receiver.address = receivers[i].Address;
                  break;
                }
              }
            }

            if (vm.receiver === null && len > 0) {
              vm.receiver = {};
              vm.receiver.receiverId = receivers[0].SysNo;
              vm.receiver.phone = receivers[0].ReceiverPhone;
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
              var sku = {};
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
          }
        });

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
          ajaxPost('/weixin/pay', {openId: openId, orderId: orderId, amount: vm.amount, userName:userName}, function (err, data) {
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
}
()
)
;
