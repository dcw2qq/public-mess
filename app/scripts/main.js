(function ($) {
  'use strict';

 
  window.JOURNEYS = {};
  
  var MAIN = window.JOURNEYS;
  
  MAIN.init = function() {
      
    //service worker
    MAIN.sw();
    
    //nav
    MAIN.mobileNav.init();

    //input Controls 
    MAIN.inputControls(); 


    $('.nav-bar').headroom({
          "offset": 0,
          "tolerance": 5
    });
        
    console.log("Main has fired");

  };


  MAIN.inputControls = function() {
   
    
    console.log("inputControls has fired");

  };

 


  MAIN.sw = function() {
  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
    if ('serviceWorker' in navigator &&
        (window.location.protocol === 'https:' ||
         window.location.hostname === 'localhost' ||
         window.location.hostname.indexOf('127.') === 0)) {
        navigator.serviceWorker.register('/service-worker.js', {
        scope: './'
        }).then(function(registration) {
          // Check to see if there's an updated version of service-worker.js with
          // new files to cache:
          // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-registration-update-method
          if (typeof registration.update === 'function') {
            registration.update();
          }

        // updatefound is fired if service-worker.js changes.
        registration.onupdatefound = function () {
          // updatefound is also fired the very first time the SW is installed,
          // and there's no need to prompt for a reload at that point.
          // So check here to see if the page is already controlled,
          // i.e. whether there's an existing service worker.
          if (navigator.serviceWorker.controller) {
            // The updatefound event implies that registration.installing is set:
            // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
            var installingWorker = registration.installing;

            installingWorker.onstatechange = function () {
              switch (installingWorker.state) {
                case 'installed':
                  // At this point, the old content will have been purged and the
                  // fresh content will have been added to the cache.
                  // It's the perfect time to display a "New content is
                  // available; please refresh." message in the page's interface.
                  break;

                case 'redundant':
                  throw new Error('The installing service worker became redundant.');
              }
            };
          }
        };
      }).catch(function (e) {
        console.error('Error during service worker registration:', e);
      });
    }
  };

  MAIN.mobileNav = function(){
    var $pageNav = $('.page-nav'),
        $pageNavList = $pageNav.find('.page-nav_list'),
        toggleBtnClass = '.nav-toggle',
        $toggle = $(toggleBtnClass),
        $toggleIcon = $toggle.find('[class^="oui-icon-"]'),
        iconClasses = 'oui-icon-menu oui-icon-close';
    
  

    function showMenu() {   
        /*disableScroll();*/
        $toggle.attr({
            'aria-expanded' : true,
            'aria-pressed'  : true
          });
        $toggleIcon.toggleClass(iconClasses);
        $toggle.focus()
        $('.nav-on').toggleClass('show')
        $('.nav-off').toggleClass('show')
        .find('.nav-toggle_label').text('Close Menu');
    }

    function hideMenu() {
        /*enableScroll();*/
        $toggle
          .removeAttr('aria-pressed')
          .attr('aria-expanded','false')
          $('.nav-on').toggleClass('show')
          $('.nav-off').toggleClass('show')
          .find('.nav-toggle_label').text('Open Menu');
        $toggleIcon.toggleClass(iconClasses);
    }

    function toggleNav(e) {
        var _toggle = $toggle.attr('aria-pressed') ? hideMenu() : showMenu();
        return _toggle;
    }
   

    return {
        init: function() {
          $pageNav.on('click', toggleBtnClass, toggleNav);
          $('.page-nav_list a').on('click',hideMenu);
          $pageNavList
            .attr({
              'id':'page-nav_list',
              'aria-label': "Page navigation list"
            });
          $toggle.attr({
            'aria-haspopup' : true,
            'aria-controls' : 'page-nav_list',
            'aria-expanded' : false
          });
        },
        toggle:function(){ toggleNav(); },
      };

  }();

  $( document ).ready(function() {
    console.log( "ready!" );
    MAIN.init();
    //MAIN.dateSlider();
    //MAIN.mobileNav();
   
  });
  

  

})(jQuery);
