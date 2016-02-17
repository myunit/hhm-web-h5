/**
 * @author qianqing
 * @create by 16-2-15
 * @description index page controller
 */
require.config({
  baseUrl: './js',
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

    $(document).on("pageInit", "#index-page", function(e, id, page) {
      var vm = new Vue({
        el: '#index-page',
        data: {
          search: ''
        }
      });

      $(page).on('click','.icon-clear', function () {
        vm.search = '';
      });

      $(function() {
        $(".swiper-container").swiper({
          spaceBetween: 30,
          continuous: true,
          autoplay: 2500,
          autoplayDisableOnInteraction: false
        });
      });
    });

    $.init();
  }
);
