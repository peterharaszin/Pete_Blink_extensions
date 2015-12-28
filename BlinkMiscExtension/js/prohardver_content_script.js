/**
 * Content script for the http://prohardver.hu site
 * @author Pete
 */

window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false); //remove listener, no longer needed
    init();  
}, false);

function init(){
  console.log('Hello prohardver.hu');
  
  // var lenovoStyleSheet = document.querySelector('link[href="/dl/css/lenovo.css"]');
  
  // // remove the ugly Lenovo marketing stylesheet
  // if(lenovoStyleSheet !== null) {
    // lenovoStyleSheet.remove();
  // }
  
  
}
