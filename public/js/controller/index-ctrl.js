/**
 * @author qianqing
 * @create by 16-2-15
 * @description index page controller
 */
(function () {
  require.config({
    baseUrl: './js',
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
        if (data.status === -1) {
          $.toast(data.msg, 2000);
          setTimeout(function () {
            location.href = '/logout';
          }, 2000);
        } else {
          if (data.status) {
            cb(null, data);
          } else {
            cb(data.msg, null);
          }
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
            searchWord: '',
            banners: [
              {
                "img": "http://img.alicdn.com/tps/i1/TB1M8ZOLVXXXXX8XpXXX3a8GpXX-700-500.jpg",
                "url": "http://wxp.xitie10.com/product/new"
              },
              {
                "img": "http://img.alicdn.com/tps/i1/TB11.gILVXXXXaQXpXXP3C8GpXX-700-500.png",
                "url": "http://wxp.xitie10.com/product/secKill"
              },
              {
                "img": "http://img.alicdn.com/tps/i1/TB1S3oNLVXXXXXSXpXXX3a8GpXX-700-500.jpg",
                "url": "http://wxp.xitie10.com/product/group"
              },
              {
                "img": "http://img.alicdn.com/tps/i1/TB1S3oNLVXXXXXSXpXXX3a8GpXX-700-500.jpg",
                "url": "http://wxp.xitie10.com/product/recommend?id=14&name=0323栏目一"
              }],
            newsImg: '',
            salesImg: '',
            groupImg: '',
            secKillImg: '',
            recommends: [],
            carousels: [],
            message: 0,
            swiper: null
          },
          methods: {
            search: search,
            goToDetail: goToDetail,
            carouselClick: carouselClick
          }
        });

        function goToDetail (recommendId, index) {
          var recommend = vm.recommends.filter(function (item) {
            return item.SysNo === recommendId;
          });

          if (recommend.length > 0) {
            var product = recommend[0].RecommendItems[index];
            if (product.isCombination) {
              location.href = '/product/group-detail?id='+product.ProductGroupSysNo;
            } else {
              location.href = '/product/detail?id='+product.ProductGroupSysNo;
            }
          }
        }

        function search () {
          location.href = '/product/search?key=' + encodeURI(encodeURI(vm.searchWord));
        }

        function carouselClick (index) {
          var carousel = vm.carousels[index];
          if (!carousel) {
            return;
          }

          if (carousel.RecommendSubType === 2) {
            //跳转秒杀
            location.href = '/product/secKill';
            return;
          }

          if (carousel.RecommendSubType === 0) {
            location.href = '/product/recommend?id='+carousel.SysNo+'&name='+carousel.RecommendName;
            return;
          }

          if (carousel.RecommendSubType === 1) {
            ajaxPost('/product/get-carousel', {carouselId: carousel.SysNo}, function (err, data) {
              $.hidePreloader();
              if (err) {
                $.toast(err, 1000);
              } else {
                if (data.carousel.length > 0 && data.carousel[0].RecommendItems.length > 0) {
                  location.href = '/product/detail?id=' + data.carousel[0].RecommendItems[0].ProductGroupSysNo;
                }
              }
            });
            $.showPreloader('请稍等...');
            return;
          }
        }

        ajaxPost('/get-home', {}, function (err, data) {
          $.hidePreloader();
          if (err) {
            $.toast(err, 1000);
          } else {
            var home = data.home;
            vm.newsImg = home.news.img;
            vm.salesImg = home.sales.img;
            vm.groupImg = home.group.img;
            vm.secKillImg = home.secKill.img;
            //vm.recommends = home.recommend.length > 6 ? home.recommend.slice(0, 6) : home.recommend.slice();
            vm.recommends = home.recommend.slice();
            vm.carousels = home.carousel.slice();
            Vue.nextTick(function () {
              vm.swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                spaceBetween: 10,
                centeredSlides: true,
                autoplay: 2500,
                autoplayDisableOnInteraction: false
              });
            });
          }
        });
        $.showPreloader('请稍等...');

        ajaxPost('/users/get-notice-count', {}, function (err, data) {
          if (err) {
          } else {
            vm.message = data.count;
          }
        });

        $(page).on('click', '.icon-clear', function () {
          vm.searchWord = '';
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
            captchaMsg: '',
            captcha: '',
            password: '',
            rePassword: '',
            phone: '',
            inviteCode: ''
          },
          computed:{
            isDisable: function () {
              return !(this.phone && this.captcha && this.password && this.rePassword)
            }
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

          ajaxPost('/is-registered', {'phone': vm.phone}, function (err, data) {
            if (err) {
              $.toast(err, 1000);
            } else {
              if (!data.isRegistered) {
                ajaxPost('/get-captcha', {'phone': vm.phone, 'type': 1}, function (err, data) {
                  $.hidePreloader();
                  if (err) {
                    $.toast(err, 1000);
                  } else {
                    var time = 60;
                    vm.captchaTip = time + '秒';
                    vm.isSendCaptcha = true;
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
              } else {
                $.toast('该手机号已注册', 1000);
              }
            }
          });
        }

        function submitReg(event) {
          if (vm.isDisable) {
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

          if (vm.password.length < 6) {
            $.toast("密码长度不能小于6位", 1000);
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
            'captcha': vm.captcha,
            'inviteCode': vm.inviteCode
          }, function (err, data) {
            $.hidePreloader();
            if (err) {
              $.toast(err, 1000);
            } else {
              var url = data.redirect;
              ajaxPost('/', {'username': vm.phone, 'password': vm.password}, function (err, data) {
                $.hidePreloader();
                if (err) {
                  $.toast(err, 1000);
                } else {
                  location.href = url;
                }
              });
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
            pcdName: ['浙江省', '嘉兴市', '南湖区'],
            pcdCode: [13,93,1000],
            address: '',
            street: '建设街道',
            streetId: 12111,
            streetList: [],
            streetPicker: []
          },
          methods: {
            submitInfo: submitInfo
          }
        });


        $("#city-picker").cityPicker({
          toolbarTemplate: '<header class="bar bar-nav"><button class="button button-link pull-right close-picker">确定</button>\
        <h1 class="title">选择收货地址</h1></header>',
          onClose: pcdDesChanged
        });

        getStreetList(1000, function () {
          setStreetPicker();
        });

        function setStreetPicker () {
          $("#street-picker").picker({
            toolbarTemplate: '<header class="bar bar-nav"><button class="button button-link pull-right close-picker">\
              确定</button><h1 class="title">选择街道</h1></header>',
            onClose: streetChanged,
            cols: [
              {
                textAlign: 'center',
                values: vm.streetPicker
              }
            ]
          });
        }

        function pcdDesChanged() {
          var val = vm.pcdDes.split(' ');
          var pcd = Utils.getPCD(val[0],val[1],val[2]);
          vm.pcdCode.splice(0, vm.pcdCode.length);
          vm.pcdName.splice(0, vm.pcdName.length);
          vm.pcdCode.push(pcd.province.id);
          vm.pcdCode.push(pcd.city.id);
          vm.pcdCode.push(pcd.district.id);
          vm.pcdName.push(val[0]);
          vm.pcdName.push(val[1]);
          vm.pcdName.push(val[2]);
          getStreetList(pcd.district.id, function () {
            vm.street = vm.streetPicker[0];
            setStreetPicker();
          });
        }

        function streetChanged() {
          for (var i = 0; i < vm.streetList.length; i++) {
            var street = vm.streetList[i];
            if (street.Name === vm.street) {
              vm.streetId = street.SysNo;
              return;
            }
          }
        }

        function getStreetList (districtId, cb) {
          ajaxPost('/address/get-street', {districtId: districtId}, function (err, data) {
            $.hidePreloader();
            if (err) {
              $.toast(err, 1000);
              cb (err);
            } else {
              vm.streetList = data.street.slice();
              vm.streetPicker.splice(0, vm.streetPicker.length);
              for(var i = 0; i < vm.streetList.length; i++) {
                vm.streetPicker.push(vm.streetList[i].Name);
              }
              cb(null);
            }
          });
          $.showPreloader('请稍等');
        }

        function submitInfo(event) {
          if (vm.phone && !Utils.checkMobile(vm.phone)) {
            $.toast("请输入正确的手机号", 1000);
            return;
          }

          ajaxPost('/register-complete',
            {
              'phone': vm.phone,
              'storeName': vm.storeName,
              'receiver': vm.receiver,
              'pcdCode': vm.pcdCode,
              'pcdName': vm.pcdName,
              'street': vm.street,
              'streetId': vm.streetId,
              'address': vm.address
            },
            function (err, data) {
              $.hidePreloader();
              if (err) {
                $.toast(err, 1000);
              } else {
                $.toast('恭喜您, 注册成功！', 1000);
                var url = data.redirect;
                setTimeout(function () {
                  location.href = url;
                }, 1000);
              }
            }
          );

          $.showPreloader('请稍等');
        }
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
          computed:{
            isDisable: function () {
              return !(this.phone && this.captcha && this.password && this.rePassword)
            }
          },
          methods: {
            sendCaptcha: sendCaptcha,
            restPW: restPW
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

          ajaxPost('/is-registered', {'phone': vm.phone}, function (err, data) {
            if (err) {
              $.toast(err, 1000);
            } else {
              if (data.isRegistered) {
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
              } else {
                $.toast('该手机号未注册', 1000);
              }
            }
          });
        }

        function restPW(event) {
          if (vm.isDisable) {
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

          if (vm.password.length < 6) {
            $.toast("密码长度不能小于6位", 1000);
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
}());
