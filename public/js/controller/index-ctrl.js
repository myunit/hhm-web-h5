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
    $(function() {
      $(".swiper-container").swiper({
        spaceBetween: 30,
        continuous: true,
        autoplay: 2500,
        autoplayDisableOnInteraction: false
      });
    });
    $.init();
  }
);
