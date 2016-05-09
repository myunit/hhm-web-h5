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
              obj.pcdDes = receivers[i].Province + ' ' + receivers[i].City + ' ' + receivers[i].District + ' ' + receivers[i].Street;
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
        var search = Utils.getSearch(location);
        var type = 0;
        if (search['type'] !== undefined) {
          type = parseInt(search['type']);
        }
        if (location.pathname === '/address/modify') {

          if (!search['id']) {
            location.href = '/';
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
                  type: type,
                  receiverId: data.receiver.SysNo,
                  phone: data.receiver.ReceiverMobile,
                  receiver: data.receiver.ReceiverName,
                  pcdDes: data.receiver.Province + ' ' + data.receiver.City + ' ' + data.receiver.District,
                  pcdCode: [],
                  pcdName: [],
                  address: data.receiver.Address,
                  isDefault: data.receiver.IsDefault,
                  street: data.receiver.Street,
                  streetId: data.receiver.StreetId,
                  streetList: [],
                  streetPicker: []
                },
                computed: {
                  btnTitle: function () {
                    return this.type === 0 ? '完成':'保存并使用';
                  }
                }
              });
              vm.pcdCode.push(data.receiver.ProvinceId);
              vm.pcdCode.push(data.receiver.CityId);
              vm.pcdCode.push(data.receiver.DistrictId);
              vm.pcdName.push(data.receiver.Province);
              vm.pcdName.push(data.receiver.City);
              vm.pcdName.push(data.receiver.District);


              $("#city-picker").cityPicker({
                toolbarTemplate: '<header class="bar bar-nav"><button class="button button-link pull-right close-picker">\
              确定</button><h1 class="title">选择收货地址</h1></header>',
                onClose: pcdDesChanged
              });

              getStreetList(data.receiver.DistrictId, function () {
                setStreetPicker();
              });
            }
          });
          $.showPreloader('请稍等');

        } else {
          vm = new Vue({
            el: '#page-address-edit',
            data: {
              type: type,
              receiverId: 0,
              phone: '',
              receiver: '',
              pcdDes: '浙江省 嘉兴市 南湖区',
              pcdName: ['浙江省', '嘉兴市', '南湖区'],
              pcdCode: [13,93,1000],
              address: '',
              isDefault: false,
              street: '建设街道',
              streetId: 12111,
              streetList: [],
              streetPicker: []
            },
            computed: {
              btnTitle: function () {
                return this.type === 0 ? '完成':'保存并使用';
              }
            }
          });

          $("#city-picker").cityPicker({
            toolbarTemplate: '<header class="bar bar-nav"><button class="button button-link pull-right close-picker">\
          确定</button><h1 class="title">选择收货地址</h1></header>',
            onClose: pcdDesChanged
          });

          getStreetList(1000, function () {
            setStreetPicker();
          });
        }

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
            streetChanged();
          });
        }

        function streetChanged() {
          vm.streetId = 0;
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
              'pcdCode': vm.pcdCode,
              'pcdName': vm.pcdName,
              'street': vm.street,
              'streetId': vm.streetId,
              'address': vm.address,
              'isDefault': vm.isDefault
            },
            function (err, data) {
              $.hidePreloader();
              if (err) {
                $.toast(err, 1000);
              } else {
                if (!type) {
                  window.history.back();
                } else {
                  location.href = '/book/confirm?id='+data.receiverId+'&product='+search['product']
                }

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
