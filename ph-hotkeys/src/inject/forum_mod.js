console.log("PH! hotkeys! :) (forum_mod.js)");

/**
 * Get query string values (as field-value pairs)
 * 
 * @returns {object} the query string values or null if there are no query string fields
 * 
 * @see http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript/21152762#21152762
 */
function getQueryStringValues() {
  if (window.location.search === "") {
    return null;
  }

  var queryDict = {};
  window.location.search.substr(1).split("&").forEach(function(item) {
    queryDict[item.split("=")[0]] = item.split("=")[1];
  });

  return queryDict;
}

/**
 * Get the query string field's value (from the series of field-value pairs)
 * 
 * @param {string} field The field's name
 * @returns {string} The query string field's value
 */
function getQueryStringValue(field) {
  var queryDict = getQueryStringValues();
  return (queryDict[field] !== undefined ? queryDict[field] : null);
}

function init() {
	console.log("Szia Prohardver-felhasználó!");
	
	// a navigációs linkek sorába tesszük a social ikonokat (FB, Twitter, RSS), mert az újonnan hozzáadott keresőmezőkbe alapból belelóg
	$('#navi').prepend($('.social'));

	// keresőmező igazítása, "Felhasználónév" mező beszúrása
	var searchFormWrapper = document.getElementById('ssearch');
	searchFormWrapper.style.width = "auto"; // alapból fix, 272px
	var searchFormElement = searchFormWrapper.querySelector('form[name="ssearch1"]');
	var textSearchInputElement = searchFormElement.querySelector('input[name="stext"]');
	// textSearchInputElement.tabIndex = 3;
	// sima text típusú mező helyett legyen HTML5-ös search
	textSearchInputElement.type = "search";
	textSearchInputElement.id = "stext";

	var queryDict = getQueryStringValues();
	
	// átalakítás, pl. suser=%C3%A1rv%C3%ADzt%C5%B1r%C5%91+t%C3%BCk%C3%B6rf%C3%BAr%C3%B3g%C3%A9p --> suser=árvíztűrő+tükörfúrógép --> árvíztűrő tükörfúrógép
	var fromUserQueryStringField = ( (queryDict !== null && queryDict['suser'] !== undefined) ? decodeURIComponent(queryDict['suser'].replace(/\+/g,  " ")) : "");
	var fromUsernameInputElement = document.createElement("div");
	fromUsernameInputElement.className = "text username-wrapper username-wrapper-from";
	fromUsernameInputElement.innerHTML =
		  '<label>'
		  + '  <input class="iti" type="search" name="suser" id="suser" value="' + fromUserQueryStringField + '" placeholder="Feladó" />'
		  + '</label>';
	// There is no insertAfter method. It can be emulated by combining the insertBefore method with nextSibling.
	searchFormElement.insertBefore(fromUsernameInputElement, searchFormElement.firstChild);

	var toUserQueryStringField = ( (queryDict !== null && queryDict['srtouser'] !== undefined) ? decodeURIComponent(queryDict['srtouser'].replace(/\+/g,  " ")) : "");
	var toUsernameInputElementWrapperDiv = document.createElement("div");
	toUsernameInputElementWrapperDiv.className = "text username-wrapper username-wrapper-to";
	toUsernameInputElementWrapperDiv.innerHTML =
		  '<label>'
		  + '  <input class="iti" type="search" name="srtouser" id="srtouser" value="' + toUserQueryStringField + '" placeholder="Címzett" />'
		  + '</label>';
	// https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
	// There is no insertAfter method. It can be emulated by combining the insertBefore method with nextSibling.
	searchFormElement.insertBefore(toUsernameInputElementWrapperDiv, fromUsernameInputElement.nextSibling);

	// and finally, get all the input fields and set the appropriate incrementing tabindex (for the visible ones)
	var inputFields = searchFormElement.querySelectorAll('input:not([type="hidden"])');
	for(var i = 0; i < inputFields.length; i++) {
		inputFields[i].tabIndex = i+1;
	}
}

function initJQuery() {
	console.log("Szia Prohardver-felhasználó!");
	// a navigációs linkek sorába tesszük a social ikonokat (FB, Twitter, RSS), mert az újonnan hozzáadott keresőmezőkbe alapból belelóg
	$('#navi').prepend($('.social'));
	var $searchFormWrapper = $('#ssearch');
	$searchFormWrapper.css('width', 'auto');
	var $searchFormElement = $searchFormWrapper.find('form[name="ssearch1"]');
	var $textSearchInputElement = $searchFormElement.find('input[name="stext"]');
	// sima text típusú mező helyett legyen HTML5-ös search
	$textSearchInputElement.attr('id', 'stext');
	$textSearchInputElement.attr('type', 'search');
	
	var queryDict = getQueryStringValues();
	// átalakítás, pl. suser=%C3%A1rv%C3%ADzt%C5%B1r%C5%91+t%C3%BCk%C3%B6rf%C3%BAr%C3%B3g%C3%A9p --> suser=árvíztűrő+tükörfúrógép --> árvíztűrő tükörfúrógép
	var fromUserQueryStringField = ( (queryDict !== null && queryDict['suser'] !== undefined) ? decodeURIComponent(queryDict['suser'].replace(/\+/g,  " ")) : "");
	var toUserQueryStringField = ( (queryDict !== null && queryDict['srtouser'] !== undefined) ? decodeURIComponent(queryDict['srtouser'].replace(/\+/g,  " ")) : "");
	
	var $fromUsernameInputElement = $('<input>',  {
		'class': 'iti',
		'type': 'search',
		'name': 'suser',
		'id': 'suser',
		'value': fromUserQueryStringField,
		'placeholder': 'Feladó'
	});
	var $toUsernameInputElement = $('<input>',  {
		'class': 'iti',
		'type': 'search',
		'name': 'srtouser',
		'id': 'srtouser',
		'value': toUserQueryStringField,
		'placeholder': 'Címzett'
	});
	
	var $fromUsernameLabelElement = $('<label>', {'html': $fromUsernameInputElement});
	var $toUsernameLabelElement = $('<label>', {'html': $toUsernameInputElement});

	var $fromUsernameInputElementWrapperDiv = $('<div>', {
		'class': 'text username-wrapper username-wrapper-from',
		'html':  $fromUsernameLabelElement
	});
	var $toUsernameInputElementWrapperDiv = $('<div>', {
		'class': 'text username-wrapper username-wrapper-to',
		'html':  $toUsernameLabelElement
	});
		
	$searchFormElement.prepend($toUsernameInputElementWrapperDiv).prepend($fromUsernameInputElementWrapperDiv);

	// and finally, get all the input fields and set the appropriate incrementing tabindex (for the visible ones)
	var $inputFields = $searchFormElement.find('input:not([type="hidden"])');
	$inputFields.each(function( index ) {
		$( this ).attr('tabIndex', index+1);
	});	
}

(function() {
//chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
	var navigationElement = document.getElementById('navi');
	console.log("document.getElementById('ssearch'): ", document.getElementById('ssearch'));
	console.log("document.getElementById('navi'): ", document.getElementById('navi'));
	console.log("document.readyState: ", document.readyState);
	//if (document.readyState === "interactive") {
	if (navigationElement !== null) {
      clearInterval(readyStateCheckInterval);
      //init();
      initJQuery();
    }
  }, 10);
//});
})();