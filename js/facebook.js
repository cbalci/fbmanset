initFacebook = function () {  
  
  myAppId = '140223056014875'  
  
  window.fbAsyncInit = function() {
    FB.init({
      appId  : myAppId,
      status : true, // check login status
      cookie : true, // enable cookies to allow the server to access the session
      xfbml  : true  // parse XFBML
    });
  };

  (function() {
    var e = document.createElement('script');
    e.src = document.location.protocol + '//connect.facebook.net/tr_TR/all.js';
    e.async = true;
    document.getElementById('fb-root').appendChild(e);    
  }());
}
