/**
 * Redirect "m.facebook.com" to "facebook.com"
 */

/**
 * Example:
https://m.facebook.com/photo.php?fbid=529170597272109&id=324536621068842&set=a.329750637214107.1073741828.324536621068842&source=48

https://www.facebook.com/324536621068842/photos/a.329750637214107.1073741828.324536621068842/529170597272109/?type=3&theater

https://www.facebook.com/<id>/photos/<set>/<fbid>/?type=3&theater	

https://m.facebook.com/324536621068842/photos/a.329750637214107.1073741828.324536621068842/529170597272109/?type=3&fs=7&refid=13
 */

function init() {
	var queryStringValues = getQueryStringValues();
	var requiredFields = ['id', 'set', 'fbid'];
	var requiredFieldMissing = false;
	for (var requiredField of requiredFields) { // ES6
		if(queryStringValues[requiredField] === undefined) {
			console.error(requiredField + " has not been found");
			requiredFieldMissing = true;
			break;
		}
	}
	if(requiredFieldMissing) {
		var urlWithoutMPrefix = window.location.href.replace('m.facebook', 'facebook');
		console.log("Desktop URL: "+ urlWithoutMPrefix);
	} else {
		// https://www.facebook.com/<id>/photos/<set>/<fbid>/?type=3&theater
		var url = "https://www.facebook.com/"+queryStringValues['id']+"/photos/"+queryStringValues['set']+"/"+queryStringValues['fbid']+"/";
		console.log("Desktop URL: "+url);		
	}
	//window.location.replace(url);
}

(function() {
  var readyStateCheckInterval = setInterval(function() {
  var navigationElement = document.getElementById('page');
  if (navigationElement !== null) {
      clearInterval(readyStateCheckInterval);
      init();
      //initJQuery();
    }
  }, 10);
})();