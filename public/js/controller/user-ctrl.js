/**
 * @author qianqing
 * @create by 16-2-22
 * @description user controller
 */
(function () {
  require.config({
    baseUrl: '../js',
    paths: {
      'Vue': './lib/vue.min',
      'Utils': './lib/utils.min'
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

  function getStoreName(cb) {
    ajaxPost('/users/getStoreName', {}, function (err, data) {
      cb(err, data.storeName);
    });
  }

  function Items(url, number) {
    var o = {};
    o.url = url;
    o.pageSize = number;
    o.pageId = 0;
    o.addItems = function (cb) {
      var self = this;
      ajaxPost(this.url, {
        pageId: this.pageId,
        pageSize: this.pageSize
      }, function (err, data) {
        if (err) {
          cb(err, null);
        } else {
          self.pageId++;
          cb(null, data);
        }
      });
    };
    return o;
  }

  function OrderItems(url, number, type, status) {
    var o = {};
    o.url = url;
    o.pageSize = number;
    o.pageId = 0;
    o.type = type;
    o.orderStatus = status;
    o.addItems = function (cb) {
      var self = this;
      ajaxPost(this.url, {
        pageId: this.pageId,
        pageSize: this.pageSize,
        type: this.type,
        orderStatus: this.orderStatus
      }, function (err, data) {
        if (err) {
          cb(err, null);
        } else {
          self.pageId++;
          cb(null, data);
        }
      });
    };
    return o;
  }

  require(['Vue', 'Utils'],
    function (Vue, Utils) {
      'use strict';
      Vue.config.delimiters = ['${', '}'];
      Vue.config.unsafeDelimiters = ['{!!', '!!}'];

      $(document).on("pageInit", "#page-my", function (e, id, page) {
        var vm = new Vue({
          el: '#page-my',
          data: {
            storeName: '',
            level: '',
            message: 0
          },
          methods: {
            buyReport: buyReport
          }
        });

        function buyReport () {
          location.href = '/users/go-to-report';
        }

        ajaxPost('/users/get-user-info', {}, function (err, data) {
          if (err) {
          } else {
            vm.storeName = data.user.EName;
            vm.level = data.user.CustomerGroupName;
          }
        });

        ajaxPost('/users/get-notice-count', {}, function (err, data) {
          if (err) {
          } else {
            vm.message = data.count;
          }
        });

      });

      $(document).on("pageInit", "#page-my-account", function (e, id, page) {
        var vm = new Vue({
          el: '#page-my-account',
          data: {
            storeName: ''
          }
        });

        getStoreName(function (err, storeName) {
          if (err) {
            $.toast(err, 1000);
          } else {
            vm.storeName = storeName;
          }
        });

        $(page).on('click', '#linkName', function () {
          location.href = '/users/change-shop-name';
        });

        $(page).on('click', '#linkAddress', function () {
          location.href = '/users/my-address';
        });

        $(page).on('click', '#linkPassword', function () {
          location.href = '/users/change-password';
        });
      });

      $(document).on("pageInit", "#page-change-shop-name", function (e, id, page) {
        var vm = new Vue({
          el: '#page-change-shop-name',
          data: {
            storeName: ''
          },
          methods: {
            setStoreName: setStoreName
          }
        });

        getStoreName(function (err, storeName) {
          if (err) {
            $.toast(err, 1000);
          } else {
            vm.storeName = storeName;
          }
        });

        function setStoreName(event) {
          ajaxPost('/users/setStoreName', {storeName: vm.storeName}, function (err, data) {
            $.hidePreloader();
            if (err) {
              $.toast(err, 1000);
            } else {
              location.href = '/users/account';
            }
          });

          $.showPreloader('保存中');
        }

      });

      /*$(document).on("pageInit", "#page-change-shop-style", function (e, id, page) {
       var vm = new Vue({
       el: '#page-change-shop-style',
       data: {}
       });

       $(page).on('click', 'li a', function () {
       $('li a').removeClass('my-shop-active');
       $(this).addClass('my-shop-active');
       location.href = '/users/account';
       });

       });*/

      $(document).on("pageInit", "#page-change-password", function (e, id, page) {
        var vm = new Vue({
          el: '#page-change-password',
          data: {
            oldPW: '',
            newPW: '',
            rePW: ''
          },
          computed: {
            isDisable: function () {
              return this.oldPW.length === 0 || this.newPW.length === 0 || this.rePW.length === 0;
            }
          },
          methods: {
            changePW: changePW
          }
        });

        function changePW(event) {
          if (vm.isDisable) {
            return;
          }

          if (vm.newPW.length < 6) {
            $.toast("密码长度不能小于6位", 1000);
            return;
          }

          if (vm.newPW != vm.rePW) {
            $.toast("密码输入不一致");
            return;
          }

          ajaxPost('/users/change-password', {newPassword: vm.newPW, oldPassword: vm.oldPW}, function (err, data) {
            $.hidePreloader();
            if (err) {
              $.toast(err, 1000);
            } else {
              $.toast("新密码设置成功！", 1000);
              location.href = '/users/account';
            }
          });

          $.showPreloader('保存中');
        }
      });

      $(document).on("pageInit", "#page-my-buy-report", function (e, id, page) {
        var search = Utils.getSearch(location);
        if (!search['id']) {
          location.href = '/';
          return;
        }

        var dateTime = Utils.dateFormat(new Date(), 'yyyy-MM-dd');
        var vm = new Vue({
          el: '#page-my-buy-report',
          data: {
            start: dateTime,
            end: dateTime
          },
          methods:{
            query: query
          }
        });

        function query () {
          var start = (new Date(vm.start)).getTime();
          var end = (new Date(vm.end)).getTime();
          location.href = '/users/buy-report-result?p=' + search['id'] + '!' + start + '!' + end;
        }

        $("#my-start-time").calendar({
          value: [vm.start],
          onChange: function (p, values, displayValues) {
            vm.start = displayValues;
          }
        });
        $("#my-end-time").calendar({
          value: [vm.end],
          onChange: function (p, values, displayValues) {
            vm.end = displayValues;
          }
        });

      });

      $(document).on("pageInit", "#page-my-buy-report-result", function (e, id, page) {
        var search = Utils.getSearch(location);
        if (!search['p']) {
          location.href = '/';
          return;
        }
        var p = search['p'];
        p = p.split('!');
        if (p.length < 3) {
          location.href = '/';
          return;
        }

        var userId = parseInt(p[0]);
        var start = Utils.dateFormat(new Date(parseInt(p[1])), 'yyyy-MM-dd');
        var end = Utils.dateFormat(new Date(parseInt(p[2])), 'yyyy-MM-dd');
        var vm = new Vue({
          el: '#page-my-buy-report-result',
          data: {
            reports: []
          }
        });

        ajaxPost('/users/buy-report-result', {userId: userId, start: start, end: end}, function (err, data) {
          if (err) {
          } else {
            vm.reports = Utils.clone(data.report);
            for (var i = 0; i < vm.reports.Items.length; i++) {
              var item = vm.reports.Items[i];
              $("#mytable").append('<tr><td width="50%">'+item.ProductName+'</td><td width="20%">'+item.Quantity+
              '</td><td width="30%">￥'+item.ProductAmount+'</td></tr>');
            }
          }
        });

      });

      $(document).on("pageInit", "#page-my-fav", function (e, id, page) {
        var vm = new Vue({
          el: '#page-my-fav',
          data: {
            search: '',
            cartNum: 0,
            favList: [],
            count: 0
          },
          methods: {
            addToFav: addToFav,
            OpenCart: OpenCart,
            goToDetail: goToDetail
          }
        });

        var cartVm = new Vue({
          el: '#popup-cart',
          data: {
            addCartNum: 1,
            product: null,
            curPrice: 0,
            curImg: '',
            curSkuId: 0
          },
          methods: {
            addToCart: addToCart
          }
        });

        function goToDetail (index) {
          var fav = vm.favList[index];
          var skus = fav.SkuList.filter(function (item) {
            return item.IsSeckillProduct;
          });

          if (skus.length > 0) {
            location.href = '/product/secKill-detail?id='+skus[0].SeckillSysNo;
          } else {
            location.href = '/product/detail?id='+fav.SysNo;
          }
        }

        function getCountInCart() {
          ajaxPost('/cart/get-count-in-cart', {}, function (err, data) {
            if (err) {
            } else {
              vm.cartNum = data.count;
            }
          });
        }

        getCountInCart();

        function addToCart() {
          if (cartVm.addCartNum === '') {
            cartVm.addCartNum = 1;
            $.toast('请输入正确的购买数量', 1000);
            return;
          }

          ajaxPost('/cart/add-to-cart', {
            productId: cartVm.product.SysNo,
            skuId: cartVm.curSkuId,
            qty: cartVm.addCartNum
          }, function (err, data) {
            if (err) {
              $.toast(err, 1000);
            } else {
              getCountInCart();
            }
          });


          cartVm.addCartNum = 1;
        }

        function OpenCart(index) {
          cartVm.product = vm.favList[index];
          cartVm.curSkuId = cartVm.product.SkuList[0].SysNo;
          cartVm.curPrice = cartVm.product.SkuList[0].Price;
          cartVm.curImg = cartVm.product.SkuList[0].Images[0].ImgUrl;
          $.popup('.popup-cart');
        }

        function addToFav(index) {
          var favorite = vm.favList[index];
          ajaxPost(favorite.isLike ? '/users/del-fav' : '/users/add-fav', {
            productId: favorite.SysNo
          }, function (err, data) {
            $.hidePreloader();
            if (err) {
              $.toast(err, 1000);
            } else {
              favorite.isLike = !favorite.isLike;
            }
          });
          if (vm.isLike) {
            $.showPreloader('取消收藏...');
          } else {
            $.showPreloader('收藏...');
          }
        }

        var loading = false;
        var favItems = new Items('/users/my-fav', 10);
        favItems.addItems(function (err, data) {
          if (err) {
            $.toast(err, 1000);
          } else {
            vm.count = data.count;
            vm.favList = vm.favList.concat(data.favorite);
          }
        });

        $(page).on('infinite', '.infinite-scroll-bottom', function () {

          // 如果正在加载，则退出
          if (loading) return;
          // 设置flag
          loading = true;

          // 模拟1s的加载过程
          setTimeout(function () {
            // 重置加载flag
            loading = false;

            if (vm.favList.length >= vm.count) {
              // 加载完毕，则注销无限加载事件，以防不必要的加载
              $.detachInfiniteScroll($('.infinite-scroll'));
              // 删除加载提示符
              $('.infinite-scroll-preloader').remove();
              return;
            }

            // 添加新条目
            favItems.addItems(function (err, data) {
              if (err) {
                $.toast(err, 1000);
              } else {
                vm.count = data.count;
                vm.favList = vm.favList.concat(data.favorite);
              }
            });
            //容器发生改变,如果是js滚动，需要刷新滚动
            $.refreshScroller();
          }, 1000);
        });


        $(page).on('click', '.icon-clear', function () {
          vm.search = '';
        });

        cartVm.$watch('addCartNum', function (newVal, oldVal) {
          if (newVal === '') {
            return;
          }

          if (!Utils.isPositiveNum(newVal)) {
            $.toast('请输入正确的购买数量', 500);
            Vue.nextTick(function () {
              cartVm.addCartNum = oldVal;
            });
          }
        });

        $(document).on('click', '.icon-close.close-popup', function () {
          cartVm.addCartNum = 1;
        });

        $(document).on('click', '.em-op-d', function () {
          if (cartVm.addCartNum > 1) {
            cartVm.addCartNum--;
          }
        });

        $(document).on('click', '.em-op-a', function () {
          cartVm.addCartNum++;
        });

        $(document).on('click', '.my-ul-spec li', function () {
          $('.my-ul-spec li').removeClass('my-spec-on');
          $(this).addClass('my-spec-on');
          var index = $(this).val();
          var sku = cartVm.product.SkuList[index];
          cartVm.curSkuId = sku.SysNo;
          cartVm.curPrice = sku.Price;
          cartVm.curImg = sku.Images[0].ImgUrl;
        });

      });

      $(document).on("pageInit", "#page-my-message", function (e, id, page) {
        var vm = new Vue({
          el: '#page-my-message',
          data: {
            notices: []
          },
          methods: {
            openMsg: openMsg
          }
        });

        var loading = false;
        var noticeItems = new Items('/users/my-message', 20);
        noticeItems.addItems(function (err, data) {
          if (err) {
            $.toast(err, 1000);
          } else {
            vm.count = data.count;
            vm.notices = vm.notices.concat(data.notices);
          }
        });

        function openMsg(index) {
          var notice = vm.notices[index];
          ajaxPost('/users/set-notice-status', {'noticeId': notice.NoticeSysno}, function (err, data) {
            if (err) {

            } else {
              notice.IfRead = true;
            }
          });

          $.modal({
            title:  notice.NoticeTitle+'<span class="my-message-time">'+notice.InDate+'</span>',
            text: '<p class="my-dialog-content">'+notice.NoticeContext+'<p>',
            extraClass:'my-dialog',
            buttons: [
              {
                text: '<a href="#" class="icon icon-close my-black-text"></a>'
              }
            ]
          });
        }

        $(page).on('infinite', '.infinite-scroll-bottom', function () {

          // 如果正在加载，则退出
          if (loading) return;
          // 设置flag
          loading = true;

          // 模拟1s的加载过程
          setTimeout(function () {
            // 重置加载flag
            loading = false;

            if (vm.notices.length >= vm.count) {
              // 加载完毕，则注销无限加载事件，以防不必要的加载
              $.detachInfiniteScroll($('.infinite-scroll'));
              // 删除加载提示符
              $('.infinite-scroll-preloader').remove();
              return;
            }

            // 添加新条目
            noticeItems.addItems(function (err, data) {
              if (err) {
                $.toast(err, 1000);
              } else {
                vm.count = data.count;
                vm.notices = vm.notices.concat(data.notices);
              }
            });
            //容器发生改变,如果是js滚动，需要刷新滚动
            $.refreshScroller();
          }, 1000);
        });

      });

      $(document).on("pageInit", "#page-my-address", function (e, id, page) {
        var vm = new Vue({
          el: '#page-my-address',
          data: {
            receivers: [],
            defaultIdx: null
          },
          methods: {
            deleteAdr: deleteAdr
          }
        });

        ajaxPost('/address/get-all-receiver', {}, function (err, data) {
          if (err) {
            $.toast(err, 1000);
          } else {
            var receivers = data.receiver;
            var len = receivers.length;
            for (var i = 0; i < len; i++) {
              var obj = {};
              obj.receiverId = receivers[i].SysNo;
              obj.phone = receivers[i].ReceiverMobile;
              obj.receiver = receivers[i].ReceiverName;
              obj.pcdDes = receivers[i].Province + ' ' + receivers[i].City + ' ' + receivers[i].District + ' ' + receivers[i].Street;
              obj.address = receivers[i].Address;
              obj.isDefault = receivers[i].IsDefault;
              vm.receivers.push(obj);
            }
          }
        });

        function deleteAdr(index, event) {
          $.confirm('确定删除该地址吗?',
            function () {
              ajaxPost('/address/del-receiver', {receiverId: vm.receivers[index].receiverId}, function (err, data) {
                if (err) {
                  $.toast(err, 1000);
                } else {
                  vm.receivers.splice(index, 1);
                }
              });
            },
            function () {

            }
          );
        }

        $(page).on('change', '[name="single-radio"]', function () {
          ajaxPost('/address/set-default-receiver', {receiverId: vm.receivers[vm.defaultIdx].receiverId}, function (err, data) {
            $.hidePreloader();
            if (err) {
              $.toast(err, 1000);
            } else {
              var len = vm.receivers.length;
              for (var i = 0; i < len; i++) {
                if (i === vm.defaultIdx) {
                  vm.receivers[i].isDefault = true;
                } else {
                  vm.receivers[i].isDefault = false;
                }
              }
            }
          });
          $.showPreloader('保存中');
        });
      });

      $(document).on("pageInit", "#page-my-account", function (e, id, page) {
        var vm = new Vue({
          el: '#page-my-account',
          data: {
            storeName: ''
          }
        });

        getStoreName(function (err, storeName) {
          if (err) {
            $.toast(err, 1000);
          } else {
            vm.storeName = storeName;
          }
        });

        $(page).on('click', '#linkName', function () {
          location.href = '/users/change-shop-name';
        });

        $(page).on('click', '#linkAddress', function () {
          location.href = '/users/my-address';
        });

        $(page).on('click', '#linkPassword', function () {
          location.href = '/users/change-password';
        });
      });

      $(document).on("pageInit", "#page-my-book", function (e, id, page) {
        var vm = new Vue({
          el: '#page-my-book',
          data: {
            orderListNow: [],//一個月內的订单
            orderListAgo: [],//一個月前的订单,
            countNow: 0,
            countAgo: 0
          },
          methods: {
            payOrder: payOrder,
            cancelOrder: cancelOrder,
            reBuy: reBuy
          }
        });

        function payOrder (index, type) {
          var order = null;
          if (type === 0) {
            order = vm.orderListNow[index];
          } else {
            order = vm.orderListAgo[index];
          }

          location.href = '/weixin/oauth?orderId=' + order.OrderId + '&name=' + order.ReceiverName;
          $.showPreloader('准备支付...');
        }

        function cancelOrder (index, type) {
          $.confirm('确定取消该订单吗?',
            function () {
              var order = null;
              if (type === 0) {
                order = vm.orderListNow[index];
              } else {
                order = vm.orderListAgo[index];
              }

              ajaxPost('/book/cancel', {
                orderId: order.OrderId
              }, function (err, data) {
                $.hidePreloader();
                if (err) {
                  $.toast(err, 1000);
                } else {
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

        function upDataOrder (data) {
          var i = 0;
          var order = null;
          for (i = 0; i < data.orders.length; i++) {
            order = data.orders[i];
            order.statusNote = '';
            order.canCancel = false;
            order.canPay = false;
            order.reBuy = false;
            if (order.Status === '待审核' || order.Status === '待付款') {
              if (!order.PayMent === '货到付款' && order.PaymentStatus === 0) {
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
              order.statusNote = order.Status;
              order.reBuy = true;
            }
          }
        }

        var loading = false;
        var orderItemsNow = new OrderItems('/users/my-book', 10, 0, 0);
        var orderItemsAgo = new OrderItems('/users/my-book', 10, 1, 0);
        orderItemsNow.addItems(function (err, data) {
          $.hidePreloader();
          if (err) {
            $.toast(err, 1000);
          } else {
            vm.countNow = data.count;
            upDataOrder(data);
            vm.orderListNow = vm.orderListNow.concat(data.orders);

          }
        });

        orderItemsAgo.addItems(function (err, data) {
          if (err) {
            $.toast(err, 1000);
          } else {
            vm.countAgo = data.count;
            upDataOrder(data);
            vm.orderListAgo = vm.orderListAgo.concat(data.orders);
          }
        });

        $.showPreloader('请稍等');

        $(page).on('infinite', function () {

          // 如果正在加载，则退出
          if (loading) return;
          // 设置flag
          loading = true;
          var tabIndex = 0;
          if($(this).find('.infinite-scroll.active').attr('id') == "tab1"){
            tabIndex = 0;
          }
          if($(this).find('.infinite-scroll.active').attr('id') == "tab2"){
            tabIndex = 1;
          }

          // 模拟1s的加载过程
          setTimeout(function () {
            // 重置加载flag
            loading = false;

            if (vm.orderListNow.length >= vm.countNow) {
              $('.infinite-scroll-preloader').eq(tabIndex).hide();
              return;
            }

            // 添加新条目
            if (tabIndex === 0) {
              orderItemsNow.addItems(function (err, data) {
                if (err) {
                  $.toast(err, 1000);
                } else {
                  vm.countNow = data.count;
                  upDataOrder(data);
                  vm.orderListNow = vm.orderListNow.concat(data.orders);
                }
              });
            } else {
              // 添加新条目
              orderItemsAgo.addItems(function (err, data) {
                if (err) {
                  $.toast(err, 1000);
                } else {
                  vm.countAgo = data.count;
                  upDataOrder(data);
                  vm.orderListAgo = vm.orderListAgo.concat(data.orders);
                }
              });
            }

            //容器发生改变,如果是js滚动，需要刷新滚动
            $.refreshScroller();
          }, 1000);
        });


      });

      $.init();
    }
  );
}());
