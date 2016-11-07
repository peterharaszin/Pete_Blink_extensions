console.log("Jira customizations by Pete initializing.");
/**
 * Workaround for the behavior on Jira "Hitting Escape key while editing issue description loses contents" 
 * @see https://jira.atlassian.com/browse/JRA-36670
 */
var ESCAPE_CHAR_CODE = 27;
var editingSelectorsToCheck = [
    "#create-issue-dialog", // when the Create Issue form is active
    "#edit-issue-dialog", // when the Edit Issue form is active
    ".editable-field.active" // when any form fields are active
];

// http://patorjk.com/software/taag/#p=display&f=Graffiti&t=JIRA%20mod%20by%20Pete
var consoleString = "%c\n"+
"      ____._____________    _____                       .___ ___.           __________        __            \n"+
"     |    |   \\______   \\  /  _  \\     _____   ____   __| _/ \\_ |__ ___.__. \\______   \\ _____/  |_  ____    \n"+
"     |    |   ||       _/ /  /_\\  \\   /     \\ /  _ \\ / __ |   | __ <   |  |  |     ___// __ \\   __\\/ __ \\   \n "+
"/\\__|    |   ||    |   \\/    |    \\ |  Y Y  (  <_> ) /_/ |   | \\_\\ \\___  |  |    |   \\  ___/|  | \\  ___/   \n"+
" \\________|___||____|_  /\\____|__  / |__|_|  /\\____/\\____ |   |___  / ____|  |____|    \\___  >__|  \\___  >  \n"+
"                     \\/         \\/        \\/            \\/       \\/\\/                     \\/          \\/   \n"+
"";

console.log(consoleString, "color: blue; font-size: medium; font-family: 'Courier New', Courier, 'Lucida Sans Typewriter', 'Lucida Typewriter', monospace; background-image:url('http://jira.alm.mentorg.com:8080/s/en_US-dpgxbf/6340/7/_/jira-logo-scaled.png');background-size:contain;background-repeat:no-repeat;background-position:center;");

var $document = $(document);

function isAnyEditorFieldActive() {
    for (var i = 0; i < editingSelectorsToCheck.length; i++) {
		var $editorField = $(editingSelectorsToCheck[i]);
        if ($editorField.length > 0 && $editorField.is(":visible")) {
            return true;
        }
    }
    return false;
}

$document.keydown(function(e) {
    //console.log("keydown")
    var charCode = e.charCode || e.keyCode || e.which;
    if (charCode == ESCAPE_CHAR_CODE && isAnyEditorFieldActive()) {
        // it seems like e.preventDefault() or e.stopPropagation() or returning false is not enough, we have to pop up an alert box to really stop propagation
		// BUT it does NOT work for popped up dialogs like when clicking "Create Issue"
        alert("Escape key's default behavior has been disabled.");
		return false;
    }
});
$document.keyup(function(e) {
    //console.log("keyup")
    var charCode = e.charCode || e.keyCode || e.which;
    if (charCode == ESCAPE_CHAR_CODE && isAnyEditorFieldActive()) {
		// it seems like e.preventDefault() or e.stopPropagation() or returning false is not enough, we have to pop up an alert box to really stop propagation
		// BUT it does NOT work for popped up dialogs like when clicking "Create Issue"
        alert("Escape key's default behavior has been disabled.");
        return false;
    }
});

// if any editor fields are active, let's confirm leaving the page (refreshing or closing the tab)
window.onbeforeunload = function() {
    if (isAnyEditorFieldActive()) {
        return "You are editing a field, do you really want to cancel it?";
    }
};

/**
 * @see http://stackoverflow.com/questions/9515704/building-a-chrome-extension-inject-code-in-a-page-using-a-content-script/9517879#9517879
 */
function injectScript(func) {
    var actualCode = '(' + func + ')();'
    var script = document.createElement('script');
	script.textContent = actualCode;
	(document.head||document.documentElement).appendChild(script);
	script.remove();
}

var readyObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
	if (!mutation.addedNodes) {
		return;
	}

	for (var i = 0; i < mutation.addedNodes.length; i++) {
		// do things to your newly added nodes here
		var node = mutation.addedNodes[i];
		var descriptionFieldAppeared = node.id === 'description-val';
		if(descriptionFieldAppeared) {
			console.log("desc. field appeared: ", mutation, ", mutation.type: ", mutation.type);
			readyObserver.disconnect();
			var target = document.querySelector('.issue-container');
			console.log("W'W'W' target: ", target);
			//moveDescriptionFieldToBeginningOfCustomFields();
			// this must be injected to reach the scope, context and variables (like JIRA) of the actual document
			var scriptToInject = function() {
				console.log("script injected");
								
				/**
				 * Move the Description field between the custom fields
				 */
				function moveDescriptionFieldToBeginningOfCustomFields() {
					console.log("RLY moving desc. field");
					
					var isIssue = $('#issue-content').length !== 0;
					var $customFieldsList = $('#customfieldmodule .property-list');
					var descriptionFieldListItemId = "description-field-list-item";
					var $descriptionFieldListItem = $('#'+descriptionFieldListItemId);
					var isDescriptionFieldAlreadyMoved = $('#'+descriptionFieldListItemId).length !== 0;
					// if it's not an issue, it the description field has already been moved or there are no custom fields,
					// we don't need to do anything
					if(!isIssue || $customFieldsList.length === 0) {
						return;
					}

					var $descriptionFieldDiv = $('#description-val');
					console.log("$descriptionFieldDiv: ", $descriptionFieldDiv);
					// in case of backlog items, the field is "None" by default and may not be edited - so it is useless and should be simply removed
					// but for safety, we 
					var isBacklogItem = $('#type-val').text().trim() === "Backlog item";
					var descriptionFieldDivText = $descriptionFieldDiv.text().trim();
					var isDescriptionFieldEmpty = descriptionFieldDivText === "None" || descriptionFieldDivText == "";
					if(!(isBacklogItem && isDescriptionFieldEmpty)) {
						if(isDescriptionFieldAlreadyMoved) {
							console.log("desc alr. moved");
							var $descriptionFieldDivClone = $descriptionFieldDiv.clone();
							//var $descriptionFieldListItemClone = $descriptionFieldListItem.clone();
							$descriptionFieldListItem.remove();
							//$descriptionFieldListItem = $descriptionFieldListItemClone;
						} 
						//else {
							$descriptionFieldListItem = $('<li>', {
								"id": descriptionFieldListItemId,
								"class": "item"
							});
							var $descriptionFieldWrap = $('<div>', {
								"id": "description-field-wrap",
								"class": "wrap"
							});

							var $title = $('<strong>', {
								"id": "description-field-title",
								"class": "name",
								"text": "Description"
							});
							
							$descriptionFieldListItem.append($descriptionFieldWrap);
							$descriptionFieldWrap.append($title);
							$title.after($descriptionFieldDiv);		
						//}
						$customFieldsList.prepend($descriptionFieldListItem);
					}
					$('#descriptionmodule').hide();
					
					var removeLabelsField = false;
					if(removeLabelsField) {
						var $labelsValue = $('#labels-117073-value');
						if($labelsValue.text().trim() === "None") {
							// remove its "<li>" element
							$labelsValue.parent().parent().parent().remove()
						}		
					}
				}
				
				JIRA.bind(JIRA.Events.NEW_CONTENT_ADDED,function(e,context,reason){
					console.log("new content added, reason: ", reason, ", context: ", context, ", e: ", e);
					if(reason === JIRA.CONTENT_ADDED_REASON.panelRefreshed){
						console.log("moving desc. field");
						moveDescriptionFieldToBeginningOfCustomFields();
					}
				});
				
				moveDescriptionFieldToBeginningOfCustomFields();
			};
			
			//injectScript(moveDescriptionFieldToBeginningOfCustomFields);
			injectScript(scriptToInject);
		}
		// var $node = $(node);
		// if(mutation.type !== "attributes") {
			// console.log("NOTATTR. mutation: ", mutation, ", mutation.type: ", mutation.type);
		// } else {
			// console.log("ATTR. mutation: ", mutation, ", mutation.type: ", mutation.type);
		// }
		// console.log("node.id: ", node.id, ", node.id==='description-val': ", node.id==='description-val')
	  // var $modal = $node.find('.FullPageModal__scroller');
	  // if($modal.length > 0) {
		  // // hide the overlay
		  // $modal.parent().hide();
		  // readyObserver.disconnect();
	  // }
	}
  })
});

readyObserver.observe(document, {
	childList: true
  , subtree: true
  , attributes: false
  , characterData: false
});

$(document).ready(function() {
    console.log("Jira customizations by Pete (ready event occurred).");
	/*
	//moveDescriptionFieldToBeginningOfCustomFields();
	// react to changes on body contents
	var target = document.querySelector('.issue-container');
	console.log("target: ", target);
	// https://hacks.mozilla.org/2012/05/dom-mutationobserver-reacting-to-dom-changes-without-killing-browser-performance/
	if(target !== null) {
		console.log("creating MutationObserver");
		// create an observer instance
		var observer = new MutationObserver(function(mutations) {
			//console.log("mutations: ", mutations);
			mutations.forEach(function(mutation) {
				if(mutation.type !== "attributes") {
					console.log("mutation: ", mutation, ", mutation.type: ", mutation.type);
				}
				if(mutation.type === "childList") {
					console.log("mutation type: childList");
				}
			});
		});
		 
		// configuration of the observer:
		var config = { attributes: true, childList: true, characterData: true, subtree: true }
		 
		// pass in the target node, as well as the observer options
		observer.observe(target, config);
	}
	*/
});