/**
 * @author qianqing
 * @create by 16-2-21
 * @description address controller
 */
require.config({
  baseUrl: '../js',
  paths: {
    'Vue': './lib/vue.min'
  },
  shim: {
    'Vue': {
      exports: 'Vue'
    }
  }
});

require(['Vue'],
  function (Vue) {
    'use strict';
    Vue.config.delimiters = ['${', '}'];
    Vue.config.unsafeDelimiters = ['{!!', '!!}'];

    $(document).on("pageInit", "#page-address-select", function (e, id, page) {
      var vm = new Vue({
        el: '#page-address-select',
        data: {}
      });

    });

    $(document).on("pageInit", "#page-address-edit", function (e, id, page) {
      var vm = new Vue({
        el: '#page-address-edit',
        data: {}
      });

      $(page).on('click', '.button', function () {
        window.history.back();
      });

      $("#city-picker").cityPicker({
        toolbarTemplate: '<header class="bar bar-nav"><button class="button button-link pull-right close-picker">\
        确定</button><h1 class="title">选择收货地址</h1></header>'
      });
    });

    $.init();
  }
);

/**
 * @author qianqing
 * @create by 16-2-20
 * @description book controller
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

/**
 * @author qianqing
 * @create by 16-2-19
 * @description cart controller
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

/**
 * @author qianqing
 * @create by 16-2-15
 * @description index page controller
 */
require.config({
  baseUrl: './js',
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

    $(document).on("pageInit", "#page-index", function (e, id, page) {
      var vm = new Vue({
        el: '#page-index',
        data: {
          search: '',
          hour: '02',
          min: '00',
          sec: '00'
        }
      });

      $(page).on('click', '.icon-clear', function () {
        vm.search = '';
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

    $(document).on("pageInit", "#page-login", function (e, id, page) {
      var vm = new Vue({
        el: '#page-login',
        data: {
          phone: '',
          password: ''
        },
        computed: {
          isDisable: function () {
            return this.phone.length === 0 || this.password.length === 0;
          }
        },
        methods: {
          login: login
        }
      });

      function login(event) {
        if (!vm.phone) {
          $.toast("请输入手机号", 1000);
          return;
        }

        if (!vm.password) {
          $.toast("请输入密码", 1000);
          return;
        }

        if (!Utils.checkMobile(vm.phone)) {
          $.toast("请输入正确的手机号", 1000);
          return;
        }

        if (vm.isDisable) {
          return;
        }

        ajaxPost('/', {'username': vm.phone, 'password': vm.password}, function (err, data) {
          $.hidePreloader();
          if (err) {
            $.toast(err, 1000);
          } else {
            location.href = data.redirect
          }
        });

        $.showPreloader('登录中');
      }

      $(window).resize(function () {
        $('.content').scrollTop($(window).height());
      });
    });

    $(document).on("pageInit", "#page-register", function (e, id, page) {
      var vm = new Vue({
        el: '#page-register',
        data: {
          captchaTip: '获取验证码',
          isSendCaptcha: false,
          isDisable: true,
          captchaMsg: '',
          captcha: '',
          password: '',
          rePassword: '',
          phone: ''
        },
        methods: {
          sendCaptcha: sendCaptcha,
          submitReg: submitReg
        }
      });

      function sendCaptcha(event) {
        if (vm.isSendCaptcha) {
          return;
        }

        if (!vm.phone) {
          $.toast("手机号不能为空", 1000);
          return;
        }

        if (!Utils.checkMobile(vm.phone)) {
          $.toast("请输入正确的手机号", 1000);
          return;
        }

        ajaxPost('/get-captcha', {'phone': vm.phone, 'type': 1}, function (err, data) {
          $.hidePreloader();
          if (err) {
            $.toast(err, 1000);
          } else {
            var time = 60;
            vm.captchaTip = time + '秒';
            vm.isSendCaptcha = true;
            vm.isDisable = false;
            vm.captchaMsg = '如果您未收到短信，请在60秒后再次获取';
            var sendCaptchaInterval = setInterval(function () {
              time--;
              if (time > 9) {
                vm.captchaTip = time + '秒';
              } else {
                vm.captchaTip = '0' + time + '秒';
              }
              if (time === 0) {
                vm.captchaTip = '获取验证码';
                vm.isSendCaptcha = false;
                vm.captchaMsg = '';
                clearInterval(sendCaptchaInterval);
              }
            }, 1000);
          }
        });

        $.showPreloader('发送中');
      }

      function submitReg(event) {
        if (!vm.isSendCaptcha) {
          return;
        }

        if (!vm.phone) {
          $.toast("手机号不能为空", 1000);
          return;
        }

        if (!vm.captcha) {
          $.toast("验证码不能为空", 1000);
          return;
        }

        if (!vm.password) {
          $.toast("密码不能为空", 1000);
          return;
        }

        if (vm.password != vm.rePassword) {
          $.toast("密码输入不一致", 1000);
          return;
        }

        if (!Utils.checkMobile(vm.phone)) {
          $.toast("请输入正确的手机号", 1000);
          return;
        }

        ajaxPost('/register', {
          'phone': vm.phone,
          'password': vm.password,
          'captcha': vm.captcha
        }, function (err, data) {
          $.hidePreloader();
          if (err) {
            $.toast(err, 1000);
          } else {
            location.href = data.redirect
          }
        });

        $.showPreloader('注册中');
      }
    });

    $(document).on("pageInit", "#page-register-complete", function (e, id, page) {
      var vm = new Vue({
        el: '#page-register-complete',
        data: {
          phone: '',
          storeName: '',
          receiver: '',
          pcdDes: '浙江省 嘉兴市 南湖区',
          address: ''
        },
        methods: {
          submitInfo: submitInfo
        }
      });

      function submitInfo (event) {
        if (vm.phone && !Utils.checkMobile(vm.phone)) {
          $.toast("请输入正确的手机号", 1000);
          return;
        }

        ajaxPost('/register-complete',
          {
            'phone': vm.phone,
            'storeName': vm.storeName,
            'receiver': vm.receiver,
            'pcdDes': vm.pcdDes,
            'address': vm.address
          },
          function (err, data) {
            $.hidePreloader();
            if (err) {
              $.toast(err, 1000);
            } else {
              location.href = data.redirect
            }
          }
        );

        $.showPreloader('请稍等');
      }

      $("#city-picker").cityPicker({
        toolbarTemplate: '<header class="bar bar-nav"><button class="button button-link pull-right close-picker">确定</button>\
        <h1 class="title">选择收货地址</h1></header>'
      });
    });

    $(document).on("pageInit", "#page-rest-password", function (e, id, page) {
      var vm = new Vue({
        el: '#page-rest-password',
        data: {
          captchaTip: '获取验证码',
          isSendCaptcha: false,
          isDisable: true,
          captchaMsg: '',
          captcha: '',
          password: '',
          rePassword: '',
          phone: ''
        },
        methods: {
          sendCaptcha: sendCaptcha,
          restPW: restPW
        }
      });

      function sendCaptcha (event) {
        if (vm.isSendCaptcha) {
          return;
        }

        if (!vm.phone) {
          $.toast("手机号不能为空", 1000);
          return;
        }

        if (!Utils.checkMobile(vm.phone)) {
          $.toast("请输入正确的手机号", 1000);
          return;
        }

        ajaxPost('/get-captcha', {'phone': vm.phone, 'type': 1}, function (err, data) {
          $.hidePreloader();
          if (err) {
            $.toast(err, 1000);
          } else {
            var time = 60;
            vm.captchaTip = time + '秒';
            vm.isSendCaptcha = true;
            vm.isDisable = false;
            vm.captchaMsg = '如果您未收到短信，请在60秒后再次获取';
            var sendCaptchaInterval = setInterval(function () {
              time--;
              if (time > 9) {
                vm.captchaTip = time + '秒';
              } else {
                vm.captchaTip = '0' + time + '秒';
              }
              if (time === 0) {
                vm.captchaTip = '获取验证码';
                vm.isSendCaptcha = false;
                vm.captchaMsg = '';
                clearInterval(sendCaptchaInterval);
              }
            }, 1000);
          }
        });

        $.showPreloader('发送中');
      }

      function restPW (event) {
        if (!vm.isSendCaptcha) {
          return;
        }

        if (!vm.phone) {
          $.toast("手机号不能为空", 1000);
          return;
        }

        if (!Utils.checkMobile(vm.phone)) {
          $.toast("请输入正确的手机号", 1000);
          return;
        }

        if (!vm.captcha) {
          $.toast("验证码不能为空");
          return;
        }

        if (!vm.password) {
          $.toast("密码不能为空");
          return;
        }

        if (vm.password != vm.rePassword) {
          $.toast("密码输入不一致");
          return;
        }

        ajaxPost('/rest-password',
          {
            'phone': vm.phone,
            'password': vm.password,
            'captcha': vm.captcha
          },
          function (err, data) {
            $.hidePreloader();
            if (err) {
              $.toast(err, 1000);
            } else {
              $.toast('密码重置成功, 请重新登录', 1000);
              location.href = data.redirect
            }
          }
        );

        $.showPreloader('请稍等');
      }

    });

    $.init();
  }
);

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
          $.toast(data.msg, 1000);
        } else {
          vm.categories = data.category.slice();
        }
      });

      $(page).on('click', '.icon-clear', function () {
        vm.search = '';
      });
    });

    $(document).on("pageInit", "#page-product-detail", function(e, id, page) {
      var vm = new Vue({
        el: '#page-product-detail',
        data: {
          isLike: false,
          cartNum: 3
        },
        computed: {
          liked: function () {
            return this.isLike ? '已收藏':'收藏';
          }
        }
      });

      $(page).on('click','.like', function () {
        $(this).toggleClass('icon-like');
        $(this).toggleClass('icon-likeactive');
        vm.isLike = !vm.isLike;
      });

      $(page).on('click','.my-back-top', function () {
        $('.content').scrollTop(0);
      });

      var myPhotoBrowserPopup = $.photoBrowser({
        photos : [
          '../images/demo/home-tuijian-1.jpg',
          '../images/demo/home-tuijian-2.jpg',
          '../images/demo/home-tuijian-3.jpg'
        ],
        type: 'popup'
      });

      $(page).on('click','.pb-popup',function () {
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

      $(document).on('click','.my-a-cart.close-popup', function (e) {
        if (cartVm.addCartNum === '') {
          cartVm.addCartNum = 1;
          $.toast('请输入正确的购买数量', 1000);
          e.preventDefault();
          return;
        }
        vm.cartNum += parseInt(cartVm.addCartNum);
        cartVm.addCartNum = 1;
      });

      $(document).on('click','.icon-close.close-popup', function () {
        cartVm.addCartNum = 1;
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

      $(function () {
        $(".swiper-container").swiper({
          spaceBetween: 30,
          continuous: true,
          autoplay: 2500,
          autoplayDisableOnInteraction: false
        });
      });

    });

    $(document).on("pageInit", "#page-product-group-detail", function(e, id, page) {
      var vm = new Vue({
        el: '#page-product-group-detail',
        data: {
          isLike: false,
          cartNum: 3
        },
        computed: {
          liked: function () {
            return this.isLike ? '已收藏':'收藏';
          }
        }
      });

      $(page).on('click','.like', function () {
        $(this).toggleClass('icon-like');
        $(this).toggleClass('icon-likeactive');
        vm.isLike = !vm.isLike;
      });

      $(page).on('click','.my-back-top', function () {
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

      $(document).on('click','.my-a-cart.close-popup', function () {
        if (cartVm.addCartNum === '') {
          cartVm.addCartNum = 1;
          $.toast('请输入正确的购买数量', 1000);
          return;
        }
        vm.cartNum += parseInt(cartVm.addCartNum);
        cartVm.addCartNum = 1;
      });

      $(document).on('click','.icon-close.close-popup', function () {
        cartVm.addCartNum = 1;
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

      $(function () {
        $(".swiper-container").swiper({
          spaceBetween: 30,
          continuous: true,
          autoplay: 2500,
          autoplayDisableOnInteraction: false
        });
      });
    });

    $(document).on("pageInit", "#page-product-list", function(e, id, page) {
      var type = 0;
      if (window.location.pathname === '/product/sales') {
        type = 1;
      } else if (window.location.pathname === '/product/new') {
        type = 2;
      } else if (window.location.pathname === '/product/group') {
        type = 3;
      } else if (window.location.pathname === '/product/recommend') {
        type = 4;
      }

      var vm = new Vue({
        el: '#page-product-list',
        data: {
          search: '',
          cartNum: 30
        }
      });

      $(page).on('click','.icon-clear', function () {
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

      $(document).on('click','.my-a-cart.close-popup', function () {
        if (cartVm.addCartNum === '') {
          cartVm.addCartNum = 1;
          $.toast('请输入正确的购买数量', 1000);
          return;
        }
        vm.cartNum += parseInt(cartVm.addCartNum);
        cartVm.addCartNum = 1;
      });

      $(document).on('click','.icon-close.close-popup', function () {
        cartVm.addCartNum = 1;
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
    });

    $(document).on("pageInit", "#page-product-flash-deal-list", function(e, id, page) {
      var vm = new Vue({
        el: '#page-product-flash-deal-list',
        data: {
          search: ''
        }
      });

      $(page).on('click','.icon-clear', function () {
        vm.search = '';
      });
    });

    $.init();
  }
);

/**
 * @author qianqing
 * @create by 16-2-22
 * @description user controller
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

function getStoreName(cb) {
  ajaxPost('/users/getStoreName', {}, function (err, data) {
    cb(err, data.storeName);
  });
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
          storeName: ''
        }
      });

      getStoreName(function (err, storeName) {
        if (err) {
          $.toast(data.msg, 1000);
        } else {
          vm.storeName = storeName;
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
          $.toast(data.msg, 1000);
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
          $.toast(data.msg, 1000);
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
        method: {
          changePW: changePW
        }
      });

      function changePW(event) {
        if (vm.isDisable) {
          return;
        }

        if (vm.newPW != vm.rePW) {
          $.toast("密码输入不一致");
          return;
        }

        ajaxPost('/users/change-password', {password: vm.newPW}, function (err, data) {
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
      var dateTime = Utils.dateFormat(new Date(), 'yyyy-MM-dd');
      var vm = new Vue({
        el: '#page-my-buy-report',
        data: {
          start: dateTime,
          end: dateTime
        }
      });

      $(page).on('click', '.button', function () {
        $.router.load('/users/buy-report-result');
      });

      $("#my-start-time").calendar({
        value: [vm.start]
      });
      $("#my-end-time").calendar({
        value: [vm.end]
      });

    });

    $(document).on("pageInit", "#page-my-buy-report-result", function (e, id, page) {
      var vm = new Vue({
        el: '#page-my-buy-report-result',
        data: {}
      });

    });

    $(document).on("pageInit", "#page-my-fav", function (e, id, page) {
      var vm = new Vue({
        el: '#page-my-fav',
        data: {
          search: '',
          cartNum: 30
        }
      });

      $(page).on('click', '.icon-clear', function () {
        vm.search = '';
      });

      $(page).on('click', '.like', function () {
        $(this).toggleClass('icon-like');
        $(this).toggleClass('icon-likeactive');
        if ($(this).hasClass("icon-like")) {
          $(this).children('span').text('收藏');
        } else {
          $(this).children('span').text('已收藏');
        }
      });

      $(page).on('click', '.icon-clear', function () {
        vm.search = '';
      });

      $(page).on('click', '.button', function () {
        $.popup('.popup-cart');
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

    });

    $(document).on("pageInit", "#page-my-message", function (e, id, page) {
      var vm = new Vue({
        el: '#page-my-message',
        data: {}
      });

      $(page).on('click', '.open-message-modal', function () {
        $.modal({
          title: '消息标题消息标题消息标题消息标题消息标题消息标题消息标题<span class="my-message-time">今天 09:45</span>',
          text: '<p>又到了周四大特卖！还在等什么呢！手快有，手慢无，赶紧抢货咯！又到了周四大特卖！还在等什么呢！手快有，手慢无，赶紧抢货咯！又到了周四大特卖！还在等什么呢！手快有，手慢无，赶紧抢货咯！<p>',
          extraClass: 'my-dialog',
          buttons: [
            {text: '<a href="#" class="icon icon-close my-black-text"></a>'}
          ]
        })
      });

    });

    $(document).on("pageInit", "#page-my-address", function (e, id, page) {
      var vm = new Vue({
        el: '#page-my-address',
        data: {
          receivers: [],
          defaultIdx: null,
          OPAdr: null
        },
        methods: {
          deleteAdr: deleteAdr,
          addOrEditAdr: addOrEditAdr
        }
      });

      var vmPop = undefined;

      ajaxPost('/address/get-all-receiver', {}, function (err, data) {
        if (err) {
          $.toast(err, 1000);
        } else {
          var receivers = data.receiver;
          var len = receivers.length;
          for (var i = 0; i < len; i ++) {
            var obj = {};
            obj.receiverId = receivers[i].SysNo;
            obj.phone = receivers[i].ReceiverPhone;
            obj.receiver = receivers[i].ReceiverName;
            obj.pcdDes = receivers[i].Province + ' ' + receivers[i].City + ' ' + receivers[i].District;
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

      function addOrEditAdr(index) {
        if (index >= 0) {
          $("title").text('修改地址-好好卖');
          var receiver = vm.receivers[index];
          vmPop = new Vue({
            el: '#popup-adr',
            data: {
              index: index,
              receiverId: receiver.receiverId,
              phone: receiver.phone,
              receiver: receiver.receiver,
              pcdDes: receiver.pcdDes,
              address: receiver.address,
              isDefault: receiver.isDefault
            }
          });
        } else {
          vmPop = new Vue({
            el: '#popup-adr',
            data: {
              index: -1,
              receiverId: 0,
              phone: '',
              receiver: '',
              pcdDes: '浙江省 嘉兴市 南湖区',
              address: '',
              isDefault: false
            }
          });
          $("title").text('新增地址-好好卖');
        }

        $("#city-picker").cityPicker({
          toolbarTemplate: '<header class="bar bar-nav"><button class="button button-link pull-right close-picker">确定</button>\
        <h1 class="title">选择收货地址</h1></header>'
        });

        $.popup('.popup-adr');
      }

      $(document).on('click', '.close-popup', function (event) {
        event.preventDefault();
        var url = '/address/modify-receiver';
        if (vmPop.receiverId === 0) {
          url = '/address/add-receiver';
        }
        ajaxPost(url,
          {
            'receiverId': vmPop.receiverId,
            'phone': vmPop.phone,
            'receiver': vmPop.receiver,
            'pcdDes': vmPop.pcdDes,
            'address': vmPop.address,
            'isDefault': vmPop.isDefault
          },
          function (err, data) {
            $.hidePreloader();
            if (err) {
              $.toast(err, 1000);
            } else {
              var receiver = undefined;
              if (vmPop.index === -1) {
                receiver = {};
                receiver.receiverId = data.receiverId;
                receiver.phone = vmPop.phone;
                receiver.receiver = vmPop.receiver;
                receiver.pcdDes = vmPop.pcdDes;
                receiver.address = vmPop.address;
                receiver.isDefault = vmPop.isDefault;
                vm.receivers.push(receiver);

              } else {
                receiver = vm.receivers[vmPop.index];
                receiver.phone = vmPop.phone;
                receiver.receiver = vmPop.receiver;
                receiver.pcdDes = vmPop.pcdDes;
                receiver.address = vmPop.address;
                receiver.isDefault = vmPop.isDefault;
              }


              vmPop.$destroy();
            }
          }
        );

        $.showPreloader('请稍等');

        $("title").text('地址管理-好好卖');
      });

      $(page).on('change', '[name="single-radio"]', function () {
        ajaxPost('/address/set-default-receiver', {receiverId: vm.receivers[vm.defaultIdx].receiverId}, function (err, data) {
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
            $.hidePreloader();
          }
        });
        $.showPreloader('保存中');
      });
    });

    $.init();
  }
);
