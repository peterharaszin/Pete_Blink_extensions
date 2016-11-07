console.log("Pinterest extension...");

$(document).ready(function () {
	console.log("Pinterest extension...ready");
	var observer = new MutationObserver(function(mutations) {
	  mutations.forEach(function(mutation) {
		if (!mutation.addedNodes) {
			return;
		}

		for (var i = 0; i < mutation.addedNodes.length; i++) {
		  // do things to your newly added nodes here
		  var node = mutation.addedNodes[i];
		  var $node = $(node);
		  var $modal = $node.find('.FullPageModal__scroller');
		  if($modal.length > 0) {
			  // hide the overlay
			  $modal.parent().hide();
			  observer.disconnect();
		  }
		}
	  })
	});
	
	var mainContainer = document.querySelector('.mainContainer');
	observer.observe(mainContainer, {
		childList: true
	  , subtree: true
	  , attributes: false
	  , characterData: false
	});
});