/**
 * @author qianqing
 * @create by 16-2-21
 * @description address controller
 */
+ function() {
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
}();
