/**
 * Content script for the http://agar.io site
 * @author Pete
 */

window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false); //remove listener, no longer needed
    init();  
}, false);

function init(){
  console.log('Hello agar.io');
}

/**
 * @see http://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom/21696585#21696585
 * el is the DOM element you'd like to test for visibility
 */
function isHidden(el) {
    return (el.offsetParent === null)
    // var style = window.getComputedStyle(el);
    // return (style.display === 'none')
}

function onBeforeUnload(e) {
  var message = "Would you really like to leave this site?",
  e = e || window.event;
  // For IE and Firefox
  
  // check if agar.io's greeting form is displayed
  var isFormOverlayHidden = isHidden(document.getElementById('overlays')) === true;
  
  // condition for confirming leaving the site
  if(isFormOverlayHidden){
    if (e) {
      e.returnValue = message;
    }

    // For Safari
    return message;
  }
}

/**
 * @see http://stackoverflow.com/questions/1704533/intercept-page-exit-event/1704783#1704783
 */
window.onbeforeunload = onBeforeUnload;