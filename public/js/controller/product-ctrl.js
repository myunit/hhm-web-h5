/**
 * @author qianqing
 * @create by 16-2-20
 * @description product controller
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
      var vm = new Vue({
        el: '#page-product-detail',
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

      var myPhotoBrowserPopup = $.photoBrowser({
        photos: [
          '../images/demo/home-tuijian-1.jpg',
          '../images/demo/home-tuijian-2.jpg',
          '../images/demo/home-tuijian-3.jpg'
        ],
        type: 'popup'
      });

      $(page).on('click', '.pb-popup', function () {
        myPhotoBrowserPopup.open();
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

      if (location.pathname === '/product/sales') {

      } else if (location.pathname === '/product/new') {

      } else if (location.pathname === '/product/group') {

      } else if (location.pathname === '/product/recommend') {

      } else if (location.pathname === '/product/category') {
        var search = Utils.getSearch(location);
        if (!search['CId'] || !search['ChildCId']) {
          location.pathname = '/';
          return;
        }

        ajaxPost('/product/category', {
          CId: parseInt(search['CId']),
          ChildCId: parseInt(search['ChildCId']),
          pageId: 0,
          pageSize: 45
        }, function (err, data) {
          if (err) {
            $.toast(err, 1000);
          } else {
            vm.count = data.count;
            vm.products = data.products.slice();
            console.log(JSON.stringify(data.products));
          }
        });
      }

      function addToCart(index) {
        $.popup('.popup-cart');
      }

      $(page).on('click', '.icon-clear', function () {
        vm.search = '';
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

      $(document).on('click', '.my-a-cart.close-popup', function (event) {
        event.preventDefault();
        if (cartVm.addCartNum === '') {
          cartVm.addCartNum = 1;
          $.toast('请输入正确的购买数量', 1000);
          return;
        }
        vm.cartNum += parseInt(cartVm.addCartNum);
        cartVm.addCartNum = 1;
      });

      $(document).on('click', '.icon-close.close-popup', function () {
        event.preventDefault();
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
    });

    $(document).on("pageInit", "#page-product-flash-deal-list", function (e, id, page) {
      var vm = new Vue({
        el: '#page-product-flash-deal-list',
        data: {
          search: ''
        }
      });

      $(page).on('click', '.icon-clear', function () {
        vm.search = '';
      });
    });

    $.init();
  }
);
