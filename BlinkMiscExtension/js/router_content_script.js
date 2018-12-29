console.log("Router content script by Pete");

$(document).ready(function(){
	var $newFormElement = $("<form>", {
		'class': 'loginForm',
		'action': '/',
		'method': 'post'
	});
	$('#userName').parents(".loginBox").wrap($newFormElement);
});