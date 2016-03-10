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

function isAnyEditorFieldActive() {
    for (var i = 0; i < editingSelectorsToCheck.length; i++) {
		var editorField = document.querySelector(editingSelectorsToCheck[i]);
        if (editorField != null && editorField.style.display !== "none") {
            return true;
        }
    }
    return false;
}

document.addEventListener("keydown", function(e) {
    console.log("keydown")
    var charCode = e.charCode || e.keyCode || e.which;
    if (charCode == ESCAPE_CHAR_CODE && isAnyEditorFieldActive()) {
        // it seems like e.preventDefault() or e.stopPropagation() or returning false is not enough, we have to pop up an alert box to really stop propagation
        alert("Escape key's default behavior has been disabled.");
        return false;
    }
});
document.addEventListener("keyup", function(e) {
    console.log("keyup")
    var charCode = e.charCode || e.keyCode || e.which;
    if (charCode == ESCAPE_CHAR_CODE && isAnyEditorFieldActive()) {
        // it seems like e.preventDefault() or e.stopPropagation() or returning false is not enough, we have to pop up an alert box to really stop propagation
        alert("Escape key's default behavior has been disabled.");
        return false;
    }
});

window.onbeforeunload = function() {
    if (isAnyEditorFieldActive()) {
        return "You are editing a field, do you really want to cancel it?";
    }
};