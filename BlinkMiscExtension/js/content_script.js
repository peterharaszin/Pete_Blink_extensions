/**
 * Content script for the General Blink extension
 * @author Pete
 */

window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false); //remove listener, no longer needed
    init();  
}, false);

function init(){
  
}