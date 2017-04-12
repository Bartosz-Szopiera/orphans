  // =====Run function on page load=============
  function onLoad() {
    headerTransformation();
    serviceIconAnimation();
    chartLabel();
    chartDrawingControl();
  }
  // ==============Cookies==================
  // Hide alert
  function cookieAlert() {
    var el = document.getElementById('cookieAlert');
    el.classList.add('hidden');
  }
  // Save user choice to allow cookies
  function allowCookies() {
    var today = Date();
    var miliseconds = Date.parse(today) + 1000*60*60*24*356;
    var expirationDate = new Date(miliseconds).toUTCString();
    document.cookie = "cookies_allowed=;expires=" + expirationDate;
    document.cookie = "new_session=";
    cookieAlert();
  }
  // Show cookies alert on page startup if cookies were
  // not allowed.
  if (document.cookie.search('cookies_allowed') == -1) {
    // Show cookies alert
    var el = document.getElementById('cookieAlert');
    el.classList.remove('hidden');
  }
  if (document.cookie.search('new_session') == -1) {
    // Show/hide other elements dependant on cookies:
    disclaimer();
  }
  // ===============Disclaimer==================
  // Toggle between visible and hidden disclaimer
  function disclaimer() {
    var el = document.getElementById('disclaimer');
    var delay = 0.8; //s
    el.style.transition = 'bottom ' + delay + 's';
    el.classList.toggle('hidden');
    // Add cookie after user exits the disclaimer to not
    // show it again in the current session.
    if (document.cookie.search('new_session') == -1 &&
      document.cookie.search('cookies_allowed') != -1) {
      document.cookie = 'new_session';
    }
  }
  // =============Sidebar======================
  // Hide or show sidebar
  function toggleMenu() {
    var el = document.getElementById('sidebar');
    el.classList.toggle('hidden');
  }
  // =======Add listeners=======================
  window.addEventListener('resize', headerTransformation);
  window.addEventListener('load', onLoad);
  window.addEventListener('scroll', globalHandler);
  window.addEventListener('load', removefouc);
  // ======Remove no_fouc class and listener===========
  function removefouc() {
    document.documentElement.classList.remove('no_fouc');
    window.removeEventListener('load', removefouc);
  }
  // =======Scrolling for Microsoft browsers=======
  // IE11 scrolling
  if(navigator.userAgent.match(/Trident\/7\./)) {
    // mousewheel, wheelDeta, pageYOffset should not be used
    // outside IE and some Safarmi version.
    document.body.addEventListener('mousewheel', function () {
        // remove default behavior
        event.preventDefault();
        //scroll without smoothing
        var wheelDelta = event.wheelDelta*0.7;
        var currentScrollPosition = window.pageYOffset;
        window.scrollTo(0, currentScrollPosition - wheelDelta);
    });
  }
  // Edge scrolling
  if(navigator.userAgent.match(/Edge/)) {
    // mousewheel, wheelDeta, pageYOffset should not be used
    // outside IE and some Safarmi version.
    var newScrollPosition;
    var scrollDelta;
    document.body.addEventListener('mousewheel', function () {
      // remove default behavior
      event.preventDefault();
      //scroll without smoothing
      var wheelDelta = event.wheelDelta * 0.8;
      var currentScrollPosition = window.pageYOffset;
      // Scroll smoothing
      for (var i=0; i<10; i++) {
        var delay = 5*i;
        setTimeout(function(currentScrollPosition, wheelDelta, i){
          scrollDelta = (i+1)*wheelDelta/8 * 1.4^(2+10/(9*i^2));
          newScrollPosition = currentScrollPosition - scrollDelta;
          window.scrollTo(0, newScrollPosition);
        },delay,currentScrollPosition, wheelDelta, i)
      }
      // window.scrollTo(0, currentScrollPosition - wheelDelta);
    });
  }
  // =======Handle Touch-Screen devices===========
  // Listener for touch event (removed after
  // first invocation)
  window.addEventListener('touchstart', touchDevice);
  // Handler invoked by the first touch which will
  // modify the page for touch-screen device
  function touchDevice() {
    // disable context menu as it is not useful on
    // this webpage and only distracts
    window.oncontextmenu = function () {
      return false;
    }
    // Disable :hover behavior and replace it by touch-
    // -driven event listeners
    // NOTE: array is edited destructively
    var el = document.getElementsByClassName('hover'); //array
    var item;
    var len = el.length;
    for (var i = 0; i < len; i++) {
      item = el[0];
      item.classList.remove('hover');
      item.addEventListener('touchstart', touch);
      item.addEventListener('touchcancel', unTouch);
      item.addEventListener('touchend', unTouch);
    }
    window.removeEventListener('touchstart', touchDevice);
  }
  // Apply 'touch' class for CSS styling
  // setTimoeut to remove class
  function touch() {
      this.classList.add('touch');
  }
  // Remove 'touch' class - event handler
  function unTouch() {
    this.classList.remove('touch');
  }
