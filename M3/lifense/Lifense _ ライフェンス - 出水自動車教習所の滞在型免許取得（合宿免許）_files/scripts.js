var imgEas = "easeOutCirc";
var imgEas2 = "easeOutCubic";
var imgEas3 = "easeInOutSine";
var wHeight = jQuery(window).height();
var wWidth = jQuery(window).width();
var durationSpeedFlick = 200;
var durationSpeed1 = 400;
var durationSpeed2 = 800;
var durationSpeed3 = 1200;
var durationSpeed4 = 2400;
var mqWidth = 1024;
var mqWidthS = 569;
var topVideoWidth, topVideoHeight;
var beforePos = 0;
var elemTop = 0;

jQuery(document).ready(function (jQuery) {
  setup();
  addEvent();
});

// jQuery(window).on("load", function () {
// wResize();
// jQuery(window).on('resize', $.throttle(500, wResize));
// addEvent();
// });

function setup() {
  if (isSP()) {
    jQuery("body").addClass("smartphone");
  } else {
  }

  //外部URLのリンクを別ウィンドウで開く
  jQuery("a[href^=http]")
    .not('[href*="' + location.hostname + '"]')
    .attr("target", "_blank");

  linkblock();
}

function addEvent() {
  //click null
  jQuery("a.null").click(function () {
    event.preventDefault();
  });

  jQuery(document).on("click", "#js-globalMenu", function (event) {
    if (jQuery("#js-header").attr("data-u-menu") != "open") {
      menuOpen();
    } else {
      menuClose();
    }
  });

  inviewToggle();

  // if (wWidth < mqWidth) {
  //   smoothScroll(durationSpeed3, imgEas2);
  // } else {
  //   smoothScroll(durationSpeed3, imgEas2);
  // }
  smoothScroll(durationSpeed3, imgEas2);
  pageTransition(durationSpeed3, imgEas2, 0);

  if (jQuery("#js-noHero").length) {
    // console.log("js-noHero");
  } else {
    // console.log("Hero!!");
    wScroll();
    jQuery(window).on("scroll", $.throttle(500, wScroll));
  }

  //loading
  if (jQuery("#js-mainvisual").length) {
    setTimeout(function () {
      jQuery("#js-loading")
        .velocity("stop")
        .velocity("fadeOut", {
          duration: durationSpeed4,
          easing: imgEas3,
          delay: durationSpeed1,
          complete: function (elements) {},
        });
      setTimeout(function () {
        jQuery(".js-loadingAnimation2").attr("data-is-active", "true");
      }, 2000);
      setTimeout(function () {
        jQuery(".js-loadingAnimation3").attr("data-is-active", "true");
      }, 3500);

      var topSlider = jQuery("#js-topSlide");
      var initialDelay = 3800;
      topSlider
        .on("init", function () {
          setTimeout(function () {
            jQuery('.slick-slide[data-slick-index="0"]').attr("data-is-active", "true");
          }, 1000);
        })
        .slick({
          lazyLoad: "progressive",
          fade: true,
          speed: 3000,
          autoplaySpeed: 4000,
          pauseOnFocus: false,
          arrows: false,
          dots: false,
          autoplay: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          pauseOnFocus: false,
          pauseOnHover: false,
          pauseOnDotsHover: false,
        })
        .on({
          beforeChange: function (event, slick, currentSlide, nextSlide) {
            jQuery(".slick-slide", this).eq(nextSlide).attr("data-is-active", "true");
            // "add-zoom"のclassを消すための"remove-zoom"classを付与
            jQuery(".slick-slide", this).eq(currentSlide).attr("data-is-hide", "true");
          },
          afterChange: function () {
            jQuery('[data-is-hide="true"]', this).attr("data-is-active", "false").attr("data-is-hide", "false");
          },
        })
        .slick("slickPause");
      setTimeout(function () {
        topSlider.slick("slickPlay");
      }, initialDelay);
    }, 1000);
  } else {
    setTimeout(function () {
      jQuery("#js-loading")
        .velocity("stop")
        .velocity("fadeOut", {
          duration: durationSpeed2,
          easing: imgEas3,
          delay: durationSpeed1,
          complete: function (elements) {},
        });
      // setTimeout(function () {
      //   jQuery(".js-loadingAnimation2").attr("data-is-active", "true");
      // }, 2000);
      // setTimeout(function () {
      //   jQuery(".js-loadingAnimation3").attr("data-is-active", "true");
      // }, 3500);
    }, 400);
  }
}

function wScroll() {
  var fix = jQuery("#js-header");
  var fixTop = wHeight;
  // console.log("fixTop=" + fixTop + " scrollTop=" + jQuery(window).scrollTop());

  if (jQuery(window).scrollTop() >= fixTop) {
    if (fix.attr("data-is-scroll") != "true") {
      fix.attr("data-is-scroll", "true");
      jQuery("#js-pagetop").attr("data-is-scroll", "true");
    }
  } else {
    fix.attr("data-is-scroll", "false");
    jQuery("#js-pagetop").attr("data-is-scroll", "false");
  }
}

function wResize() {
  wWidth = jQuery(window).width();
  wHeight = jQuery(window).height();
}

function menuOpen() {
  jQuery("#js-header").attr("data-u-menu", "open");
  jQuery("#js-globalNav").velocity("stop").velocity("fadeIn", {
    duration: durationSpeed1,
    easing: imgEas,
    display: "flex",
  });
  jQuery("#js-globalNav").find('[data-u-ani="stagger"]').velocity("transition.slideLeftIn", {
    duration: durationSpeed3,
    easing: imgEas,
    stagger: 75,
    display: "block",
  });
}

function menuClose() {
  jQuery("#js-header").attr("data-u-menu", "close");
  jQuery("#js-globalNav").velocity("stop").velocity("fadeOut", {
    duration: durationSpeed1,
    easing: imgEas,
  });
  jQuery("#js-globalNav").find('[data-u-ani="stagger"]').velocity("stop").velocity("transition.fadeOut", {
    duration: durationSpeed1,
    easing: imgEas,
    display: "block",
  });
}

function pageTransition(speed, easing, offsetval) {
  var url = jQuery(location).attr("href");
  if (url.indexOf("?scroll=") == -1) {
    // 通常の場合の処理
  } else {
    // アンカー付きの処理
    var url_sp = url.split("?scroll=");
    var hash = "#" + url_sp[url_sp.length - 1];
    var tgt = jQuery(hash);
    tgt.velocity("scroll", {
      duration: speed,
      easing: easing,
      offset: offsetval,
      delay: 300,
    });
  }
  return false;
}

function smoothScroll(speed, eas) {
  // jQuery(document).on('click', 'a[href*="#"]', function (e) {
  //   var href = jQuery(this).attr('href');
  //   var target = jQuery(href == '#' || href == '' ? 'html' : href);
  //   var position = target.offset().top + offsetval;
  //   jQuery('html, body').animate({
  //     scrollTop: position
  //   }, speed, eas);
  //   return false;
  // });

  jQuery(document).on("click", 'a[href*="#"]', function (e) {
    var href = jQuery(this).attr("href"),
      target = jQuery(href === "#" || href === "" ? "html" : href);
    var offsetval = parseInt(jQuery(".l-section").css("padding-top"), 10);
    offsetval = 0;
    // var offsetval = 0;
    // if (wWidth < mqWidth) {
    //   offsetval = -64;
    // } else {
    //   offsetval = -120;
    // }
    if (jQuery("#js-globalMenu").attr("data-u-menu") == "open") {
      menuClose();
    }
    target.velocity("scroll", {
      duration: speed,
      easing: eas,
      offset: offsetval,
      complete: function () {},
    });
    e.preventDefault();
  });
}

//touch  device
function isSP() {
  //デバイスチェック
  var ua = navigator.userAgent.toLowerCase();
  var isiPhone = ua.indexOf("iphone") > -1;
  var isiPad = ua.indexOf("ipad") > -1;
  var isAndroid = ua.indexOf("android") > -1 && ua.indexOf("mobile") > -1;
  var isAndroidTablet = ua.indexOf("android") > -1 && ua.indexOf("mobile") == -1;
  var result = false;
  if (isiPhone || isiPad || isAndroid || isAndroidTablet) {
    result = true;
  }
  return result;
}

function linkblock() {
  jQuery(".js-linkblock").click(function () {
    if (jQuery(this).find("a").attr("target") == "_blank") {
      window.open(jQuery(this).find("a").attr("href"), "_blank");
    } else {
      window.location = jQuery(this).find("a").attr("href");
    }
    return false;
  });
}

function inviewToggle() {
  // jQuery('.js-headerActive').on('inview', function (event, isInView, visiblePartX, visiblePartY) {
  //   if (isInView) {
  //     jQuery('#js-globalMenu').removeClass('l-globalMenu--white');
  //   }
  // });
  jQuery(".js-inview-slide").on("inview", function (event, isInView, visiblePartX, visiblePartY) {
    if (isInView) {
      if ((visiblePartY = "both")) {
        if (jQuery(this).attr("data-is-active") != "true") {
          jQuery(this).attr("data-is-active", "true");
        }
      }
    }
  });

  jQuery(".js-inview-fadeInScale").on("inview", function (event, isInView, visiblePartX, visiblePartY) {
    if (isInView) {
      if ((visiblePartY = "both")) {
        if (jQuery(this).attr("data-is-active") != "true") {
          jQuery(this).attr("data-is-active", "true");
        }
      }
    }
  });
  // jQuery(".js-inview-fadeInUp").on("inview", function (event, isInView, visiblePartX, visiblePartY) {
  //   if (isInView) {
  //     if ((visiblePartY = "both")) {
  //       if (jQuery(this).attr("data-is-active") != "true") {
  //         jQuery(this).attr("data-is-active", "true");
  //       }
  //     }
  //   }
  // });
  jQuery(".js-inview-fadeIn").on("inview", function (event, isInView, visiblePartX, visiblePartY) {
    if (isInView) {
      if ((visiblePartY = "both")) {
        if (jQuery(this).attr("data-is-active") != "true") {
          jQuery(this).attr("data-is-active", "true");
        }
      }
    }
  });

  // jQuery('.js-slideUpIn').on('inview', function (event, isInView, visiblePartX, visiblePartY) {
  //   if (isInView) {
  //     if (visiblePartY = 'both') {
  //       jQuery(this).addClass('active');
  //     }
  //   }
  // });
}
