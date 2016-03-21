/**
 * @author qianqing
 * @create by 16-2-20
 * @description product controller
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

  function ProductItems(url, number, cid, childId) {
    var o = {};
    o.url = url;
    o.cid = cid || 0;
    o.childId = childId || 0;
    o.pageSize = number;
    o.pageId = 0;
    o.addItems = function (cb) {
      var self = this;
      ajaxPost(this.url, {
        CId: o.cid,
        ChildCId: o.childId,
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

  function computeTime(time) {
    var hour = Math.floor((time) / 3600000);
    var min = Math.floor(((time % 86400000) % 3600000) / 60000);
    var sec = Math.floor(((time % 86400000) % 3600000 % 60000) / 1000);
    hour = hour > 9 ? hour : '0' + hour;
    min = min > 9 ? min : '0' + min;
    sec = sec > 9 ? sec : '0' + sec;
    return hour + ':' + min + ':' + sec;
  }

  require(['Vue', 'Utils'],
    function (Vue, Utils) {
      'use strict';
      Vue.config.delimiters = ['${', '}'];
      Vue.config.unsafeDelimiters = ['{!!', '!!}'];

      $(document).on("pageInit", "#page-product-class", function (e, id, page) {
        var vm = new Vue({
          el: '#page-product-class',
          data: {
            categories: [],
            search: ''
          }
        });

        ajaxPost('/product/class', {}, function (err, data) {
          if (err) {
            $.toast(err, 1000);
          } else {
            vm.categories = data.category.slice();
          }
        });

        $(page).on('click', '.icon-clear', function () {
          vm.search = '';
        });
      });

      $(document).on("pageInit", "#page-product-detail", function (e, id, page) {
        var search = Utils.getSearch(location);
        if (!search['id']) {
          location.pathname = '/';
          return;
        }

        var vm = new Vue({
          el: '#page-product-detail',
          data: {
            isLike: false,
            cartNum: 3,
            product: null,
            style: [],
            skuImg:[]
          },
          computed: {
            liked: function () {
              return this.isLike ? '已收藏' : '收藏';
            }
          },
          methods: {
            addToCart: addToCart
          }
        });

        var cartVm = new Vue({
          el: '#popup-cart',
          data: {
            addCartNum: 1,
            curPrice: 0,
            curImg: '',
            product: null
          }
        });

        function addToCart() {
          $.popup('.popup-cart');
        }

        ajaxPost('/product/detail', {
          productId: parseInt(search['id'])
        }, function (err, data) {
          if (err) {
            $.toast(err, 1000);
          } else {
            vm.product = Utils.clone(data.product);
            cartVm.product = vm.product;
            var skuList = vm.product.Skus;
            cartVm.curPrice = skuList[0].Price;
            cartVm.curImg = skuList[0].Images[0].ImgUrl;
            for (var i = 0; i < skuList.length; i++){
              vm.style.push(skuList[i].SizeName);
              if (skuList[i].Images.length > 0) {
                vm.skuImg.push(skuList[i].Images[0].ImgUrl);
              }
            }
          }
        });

        $(page).on('click', '.like', function () {
          ajaxPost(vm.isLike ? '/users/del-fav':'/users/add-fav', {
            productId: parseInt(search['id'])
          }, function (err, data) {
            $.hidePreloader();
            if (err) {
              $.toast(err, 1000);
            } else {
              vm.isLike = !vm.isLike;
            }
          });
          if (vm.isLike) {
            $.showPreloader('取消收藏...');
          } else {
            $.showPreloader('收藏...');
          }
        });

        $(page).on('click', '.my-back-top', function () {
          $('.content').scrollTop(0);
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

        $(document).on('click', '.my-a-cart.close-popup', function (e) {
          if (cartVm.addCartNum === '') {
            cartVm.addCartNum = 1;
            $.toast('请输入正确的购买数量', 1000);
            e.preventDefault();
            return;
          }
          vm.cartNum += parseInt(cartVm.addCartNum);
          cartVm.addCartNum = 1;
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
          var sku = vm.product.Skus[index];
          cartVm.curPrice = sku.Price;
          cartVm.curImg = sku.Images[0].ImgUrl;
        });

        $(function () {
          $(".swiper-container").swiper({
            spaceBetween: 30,
            continuous: true,
            autoplay: 2500,
            autoplayDisableOnInteraction: false
          });
        });

      });

      $(document).on("pageInit", "#page-secKill-product-detail", function (e, id, page) {
        var search = Utils.getSearch(location);
        if (!search['id']) {
          location.pathname = '/';
          return;
        }

        var vm = new Vue({
          el: '#page-secKill-product-detail',
          data: {
            isLike: false,
            cartNum: 3,
            product: null,
            style: [],
            skuImg:[]
          },
          computed: {
            liked: function () {
              return this.isLike ? '已收藏' : '收藏';
            }
          },
          methods: {
            addToCart: addToCart
          }
        });

        var cartVm = new Vue({
          el: '#popup-cart',
          data: {
            addCartNum: 1,
            curPrice: 0,
            curImg: '',
            product: null
          }
        });

        function addToCart() {
          $.popup('.popup-cart');
        }

        ajaxPost('/product/secKill-detail', {
          productId: parseInt(search['id'])
        }, function (err, data) {
          if (err) {
            $.toast(err, 1000);
          } else {
            vm.product = Utils.clone(data.product);
            cartVm.product = vm.product;
            cartVm.curPrice = vm.product.SeckillPrice;
            var skuList = vm.product.Skus
            cartVm.curImg = skuList[0].Images[0].ImgUrl;
            for (var i = 0; i < skuList.length; i++){
              vm.style.push(skuList[i].SizeName);
              if (skuList[i].Images.length > 0) {
                vm.skuImg.push(skuList[i].Images[0].ImgUrl);
              }
            }
          }
        });

        $(page).on('click', '.like', function () {
          ajaxPost(vm.isLike ? '/users/del-fav':'/users/add-fav', {
            productId: parseInt(search['id'])
          }, function (err, data) {
            $.hidePreloader();
            if (err) {
              $.toast(err, 1000);
            } else {
              vm.isLike = !vm.isLike;
            }
          });
          if (vm.isLike) {
            $.showPreloader('取消收藏...');
          } else {
            $.showPreloader('收藏...');
          }
        });

        $(page).on('click', '.my-back-top', function () {
          $('.content').scrollTop(0);
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

        $(document).on('click', '.my-a-cart.close-popup', function (e) {
          if (cartVm.addCartNum === '') {
            cartVm.addCartNum = 1;
            $.toast('请输入正确的购买数量', 1000);
            e.preventDefault();
            return;
          }
          vm.cartNum += parseInt(cartVm.addCartNum);
          cartVm.addCartNum = 1;
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
          var sku = vm.product.Skus[index];
          cartVm.curPrice = sku.Price;
          cartVm.curImg = sku.Images[0].ImgUrl;
        });

        $(function () {
          $(".swiper-container").swiper({
            spaceBetween: 30,
            continuous: true,
            autoplay: 2500,
            autoplayDisableOnInteraction: false
          });
        });

      });

      $(document).on("pageInit", "#page-product-group-detail", function (e, id, page) {
        var vm = new Vue({
          el: '#page-product-group-detail',
          data: {
            isLike: false,
            cartNum: 3
          },
          computed: {
            liked: function () {
              return this.isLike ? '已收藏' : '收藏';
            }
          }
        });

        $(page).on('click', '.like', function () {
          $(this).toggleClass('icon-like');
          $(this).toggleClass('icon-likeactive');
          vm.isLike = !vm.isLike;
        });

        $(page).on('click', '.my-back-top', function () {
          $('.content').scrollTop(0);
        });

        var cartVm = new Vue({
          el: '#popup-cart',
          data: {
            addCartNum: 1
          }
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

        $(document).on('click', '.my-a-cart.close-popup', function () {
          if (cartVm.addCartNum === '') {
            cartVm.addCartNum = 1;
            $.toast('请输入正确的购买数量', 1000);
            return;
          }
          vm.cartNum += parseInt(cartVm.addCartNum);
          cartVm.addCartNum = 1;
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
        });

        $(function () {
          $(".swiper-container").swiper({
            spaceBetween: 30,
            continuous: true,
            autoplay: 2500,
            autoplayDisableOnInteraction: false
          });
        });
      });

      $(document).on("pageInit", "#page-product-list", function (e, id, page) {
        var vm = new Vue({
          el: '#page-product-list',
          data: {
            search: '',
            products: [],
            count: 0,
            cartNum: 30
          },
          methods: {
            addToCart: addToCart
          }
        });
        var productItems = undefined;
        var loading = false;

        if (location.pathname === '/product/sales') {//特卖
          productItems = new ProductItems('/product/sales', 10);
          productItems.addItems(function (err, data) {
            if (err) {
              $.toast(err, 1000);
            } else {
              vm.count = data.count;
              vm.products = vm.products.concat(data.products);
            }
          });
        } else if (location.pathname === '/product/new') {//新品
          productItems = new ProductItems('/product/new', 10);
          productItems.addItems(function (err, data) {
            if (err) {
              $.toast(err, 1000);
            } else {
              vm.count = data.count;
              vm.products = vm.products.concat(data.products);
            }
          });
        } else if (location.pathname === '/product/category') {
          var search = Utils.getSearch(location);
          if (!search['CId'] || !search['ChildCId']) {
            location.pathname = '/';
            return;
          }

          productItems = new ProductItems('/product/category', 10, parseInt(search['CId']), parseInt(search['ChildCId']));
          productItems.addItems(function (err, data) {
            if (err) {
              $.toast(err, 1000);
            } else {
              vm.count = data.count;
              vm.products = vm.products.concat(data.products);
            }
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

            if (vm.products.length >= vm.count) {
              // 加载完毕，则注销无限加载事件，以防不必要的加载
              $.detachInfiniteScroll($('.infinite-scroll'));
              // 删除加载提示符
              $('.infinite-scroll-preloader').remove();
              return;
            }

            // 添加新条目
            productItems.addItems(function (err, data) {
              if (err) {
                $.toast(err, 1000);
              } else {
                vm.count = data.count;
                vm.products = vm.products.concat(data.products);
              }
            });
            //容器发生改变,如果是js滚动，需要刷新滚动
            $.refreshScroller();
          }, 1000);
        });

        function addToCart(index) {
          cartVm.product = vm.products[index];
          cartVm.curPrice = cartVm.product.SkuList[0].Price;
          cartVm.curImg = cartVm.product.SkuList[0].Images[0].ImgUrl;
          $.popup('.popup-cart');
        }

        $(page).on('click', '.icon-clear', function () {
          vm.search = '';
        });

        var cartVm = new Vue({
          el: '#popup-cart',
          data: {
            addCartNum: 1,
            product: null,
            curPrice: 0,
            curImg: ''
          }
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

        $(document).on('click', '.my-a-cart.close-popup', function (event) {
          event.preventDefault();
          if (cartVm.addCartNum === '') {
            cartVm.addCartNum = 1;
            $.toast('请输入正确的购买数量', 1000);
            return;
          }
          vm.cartNum += parseInt(cartVm.addCartNum);
          cartVm.addCartNum = 1;
          cartVm.product = null;
        });

        $(document).on('click', '.icon-close.close-popup', function () {
          event.preventDefault();
          cartVm.addCartNum = 1;
          cartVm.product = null;
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
          cartVm.curPrice = sku.Price;
          cartVm.curImg = sku.Images[0].ImgUrl;
        });
      });

      $(document).on("pageInit", "#page-product-group-list", function (e, id, page) {
        var vm = new Vue({
          el: '#page-product-group-list',
          data: {
            search: '',
            products: [],
            count: 0,
            cartNum: 30
          },
          methods: {
            addToCart: addToCart
          }
        });
        var loading = false;

        var productItems = new ProductItems('/product/group', 10);
        productItems.addItems(function (err, data) {
          if (err) {
            $.toast(err, 1000);
          } else {
            vm.count = data.count;
            vm.products = vm.products.concat(data.products);
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

            if (vm.products.length >= vm.count) {
              // 加载完毕，则注销无限加载事件，以防不必要的加载
              $.detachInfiniteScroll($('.infinite-scroll'));
              // 删除加载提示符
              $('.infinite-scroll-preloader').remove();
              return;
            }

            // 添加新条目
            productItems.addItems(function (err, data) {
              if (err) {
                $.toast(err, 1000);
              } else {
                vm.count = data.count;
                vm.products = vm.products.concat(data.products);
              }
            });
            //容器发生改变,如果是js滚动，需要刷新滚动
            $.refreshScroller();
          }, 1000);
        });

        function addToCart(index) {
          cartVm.product = vm.products[index];
          cartVm.curPrice = cartVm.product.SkuList[0].Price;
          cartVm.curImg = cartVm.product.SkuList[0].Images[0].ImgUrl;
          $.popup('.popup-cart');
        }

        $(page).on('click', '.icon-clear', function () {
          vm.search = '';
        });

        var cartVm = new Vue({
          el: '#popup-cart',
          data: {
            addCartNum: 1,
            product: null,
            curPrice: 0,
            curImg: ''
          }
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

        $(document).on('click', '.my-a-cart.close-popup', function (event) {
          event.preventDefault();
          if (cartVm.addCartNum === '') {
            cartVm.addCartNum = 1;
            $.toast('请输入正确的购买数量', 1000);
            return;
          }
          vm.cartNum += parseInt(cartVm.addCartNum);
          cartVm.addCartNum = 1;
          cartVm.product = null;
        });

        $(document).on('click', '.icon-close.close-popup', function () {
          event.preventDefault();
          cartVm.addCartNum = 1;
          cartVm.product = null;
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
          cartVm.curPrice = sku.Price;
          cartVm.curImg = sku.Images[0].ImgUrl;
        });
      });

      $(document).on("pageInit", "#page-recommend-list", function (e, id, page) {
        var vm = new Vue({
          el: '#page-recommend-list',
          data: {
            search: '',
            products: [],
            count: 0,
            cartNum: 30
          },
          methods: {
            addToCart: addToCart
          }
        });

        var loading = false;

        var search = Utils.getSearch(location);
        if (!search['id']) {
          location.pathname = '/';
          return;
        }

        var productItems = new ProductItems('/product/recommend', 10, parseInt(search['id']));
        productItems.addItems(function (err, data) {
          if (err) {
            $.toast(err, 1000);
          } else {
            vm.count = data.count;
            console.log('data:' + JSON.stringify(data));
            vm.products = vm.products.concat(data.products);
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

            if (vm.products.length >= vm.count) {
              // 加载完毕，则注销无限加载事件，以防不必要的加载
              $.detachInfiniteScroll($('.infinite-scroll'));
              // 删除加载提示符
              $('.infinite-scroll-preloader').remove();
              return;
            }

            // 添加新条目
            productItems.addItems(function (err, data) {
              if (err) {
                $.toast(err, 1000);
              } else {
                vm.count = data.count;
                vm.products = vm.products.concat(data.products);
              }
            });
            //容器发生改变,如果是js滚动，需要刷新滚动
            $.refreshScroller();
          }, 1000);
        });

        function addToCart(index) {
          cartVm.product = vm.products[index];
          cartVm.curPrice = cartVm.product.SkuList[0].Price;
          cartVm.curImg = cartVm.product.SkuList[0].Images[0].ImgUrl;
          $.popup('.popup-cart');
        }

        $(page).on('click', '.icon-clear', function () {
          vm.search = '';
        });

        var cartVm = new Vue({
          el: '#popup-cart',
          data: {
            addCartNum: 1,
            product: null,
            curPrice: 0,
            curImg: ''
          }
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

        $(document).on('click', '.my-a-cart.close-popup', function (event) {
          event.preventDefault();
          if (cartVm.addCartNum === '') {
            cartVm.addCartNum = 1;
            $.toast('请输入正确的购买数量', 1000);
            return;
          }
          vm.cartNum += parseInt(cartVm.addCartNum);
          cartVm.addCartNum = 1;
          cartVm.product = null;
        });

        $(document).on('click', '.icon-close.close-popup', function () {
          event.preventDefault();
          cartVm.addCartNum = 1;
          cartVm.product = null;
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
          cartVm.curPrice = sku.Price;
          cartVm.curImg = sku.Images[0].ImgUrl;
        });
      });

      $(document).on("pageInit", "#page-product-flash-deal-list", function (e, id, page) {
        var vm = new Vue({
          el: '#page-product-flash-deal-list',
          data: {
            search: '',
            count: 0,
            products: []
          }
        });

        function computeRemainStartTime(obj) {
          if (obj.RemainStartTotalSeconds > 0) {
            obj.RemainStartTotalSeconds -= 1000;
            obj.remainStart = computeTime(obj.RemainStartTotalSeconds);
          } else {
            obj.killStatus = 1;
            var endTime = (new Date(obj.EndTime)).getTime();
            var nowTime = (new Date).getTime();
            obj.RemainEndTotalSeconds = endTime - nowTime;
          }
        }

        function computeRemainEndTime(obj) {
          if (obj.RemainEndTotalSeconds > 0) {
            obj.RemainEndTotalSeconds -= 1000;
            obj.remainEnd = computeTime(obj.RemainEndTotalSeconds);
          } else {
            obj.killStatus = 0;
          }
        }

        var productItems = new ProductItems('/product/secKill', 10);
        productItems.addItems(function (err, data) {
          if (err) {
            $.toast(err, 1000);
          } else {
            vm.count = data.count;
            var products = data.products;
            var len = products.length;
            var product = null;
            for (var i = 0; i < len; i++) {
              product = products[i];
              product.RemainStartTotalSeconds = parseInt(product.RemainStartTotalSeconds) * 1000;
              product.RemainEndTotalSeconds = parseInt(product.RemainEndTotalSeconds) * 1000;
              if (product.RemainEndTotalSeconds > 0) {
                product.killStatus = 1;//开始秒杀
                product.remainEnd = computeTime(product.RemainEndTotalSeconds);
              } else if (product.RemainStartTotalSeconds > 0) {
                product.killStatus = 2;//即将开始
                product.remainStart = computeTime(product.RemainStartTotalSeconds);
              } else {
                product.killStatus = 0;//已经结束
              }
            }
            vm.products = vm.products.concat(data.products);
          }
        });

        setInterval(function () {
          var products = vm.products;
          var len = products.length;
          var product = null;
          for (var i = 0; i < len; i++) {
            product = products[i];
            if (product.killStatus === 1) {
              computeRemainEndTime(product);
            } else if (product.killStatus === 2) {
              computeRemainStartTime(product);
            } else {
              continue;
            }
          }
        }, 1000);

        $(page).on('click', '.icon-clear', function () {
          vm.search = '';
        });
      });

      $.init();
    }
  );
}());
