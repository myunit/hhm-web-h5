/**
 * @author qianqing
 * @create by 16-2-22
 * @description user controller
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

    $(document).on("pageInit", "#page-my", function (e, id, page) {
      var vm = new Vue({
        el: '#page-my',
        data: {
        }
      });

    });

    $.init();
  }
);
