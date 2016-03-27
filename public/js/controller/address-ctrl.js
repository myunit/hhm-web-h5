/**
 * @author qianqing
 * @create by 16-2-21
 * @description address controller
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

      $(document).on("pageInit", "#page-address-select", function (e, id, page) {
        var search = Utils.getSearch(location);
        var selectId = 0;
        if (search['id']) {
          selectId = parseInt(search['id']);
        }

        var vm = new Vue({
          el: '#page-address-select',
          data: {
            receivers: [],
            productIdStr: search['product']
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
              obj.pcdDes = receivers[i].Province + ' ' + receivers[i].City + ' ' + receivers[i].District;
              obj.address = receivers[i].Address;
              obj.isDefault = receivers[i].IsDefault;
              obj.isSelected = (obj.receiverId === selectId);
              vm.receivers.push(obj);
            }
          }
        });

      });

      $(document).on("pageInit", "#page-address-edit", function (e, id, page) {
        var vm = undefined;

        if (location.pathname === '/address/modify') {
          var search = Utils.getSearch(location);
          if (!search['id']) {
            location.pathname = '/';
            return;
          }
          var receiverId = parseInt(search['id']);
          ajaxPost('/address/get-all-receiver', {receiverId: receiverId}, function (err, data) {
            $.hidePreloader();
            if (err) {
              $.toast(err, 1000);
            } else {
              vm = new Vue({
                el: '#page-address-edit',
                data: {
                  receiverId: data.receiver.SysNo,
                  phone: data.receiver.ReceiverMobile,
                  receiver: data.receiver.ReceiverName,
                  pcdDes: data.receiver.Province + ' ' + data.receiver.City + ' ' + data.receiver.District,
                  address: data.receiver.Address,
                  isDefault: data.receiver.IsDefault
                }
              });

              $("#city-picker").cityPicker({
                toolbarTemplate: '<header class="bar bar-nav"><button class="button button-link pull-right close-picker">\
              确定</button><h1 class="title">选择收货地址</h1></header>'
              });
            }
          });
          $.showPreloader('请稍等');

        } else {
          vm = new Vue({
            el: '#page-address-edit',
            data: {
              receiverId: 0,
              phone: '',
              receiver: '',
              pcdDes: '浙江省 嘉兴市 南湖区',
              address: '',
              isDefault: false
            }
          });
          $("#city-picker").cityPicker({
            toolbarTemplate: '<header class="bar bar-nav"><button class="button button-link pull-right close-picker">\
          确定</button><h1 class="title">选择收货地址</h1></header>'
          });
        }

        $(page).on('click', '.button', function (event) {
          event.preventDefault();
          var url = '/address/modify-receiver';
          if (vm.receiverId === 0) {
            url = '/address/add-receiver';
          }
          ajaxPost(url,
            {
              'receiverId': vm.receiverId,
              'phone': vm.phone,
              'receiver': vm.receiver,
              'pcdDes': vm.pcdDes,
              'address': vm.address,
              'isDefault': vm.isDefault
            },
            function (err, data) {
              $.hidePreloader();
              if (err) {
                $.toast(err, 1000);
              } else {
                window.history.back();
              }
            }
          );

          $.showPreloader('保存中');
        });
      });

      $.init();
    }
  );
}());
