/**
 * @author qianqing
 * @create by 16-2-18
 * @description product second kill list controller
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

    $(document).on("pageInit", "#product-secKill-list", function(e, id, page) {
      var vm = new Vue({
        el: '#product-secKill-list',
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
