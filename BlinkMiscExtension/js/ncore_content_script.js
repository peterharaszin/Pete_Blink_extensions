/**
 * Content script for the https://nCore.cc site
 * @author Pete
 */

window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false); //remove listener, no longer needed
    init();  
}, false);

function init(){
    console.log('Hello ncore.cc');
    var searchForm = document.getElementById("kereses_mezo");
    // change the form's method to GET automatically instead of POST
    // this works here (they use the $_REQUEST array so this works anyway)
    // this way the search string will be in a query string and going 
    // backwards or forward in the browser does not cause any trouble (the 
    // warning message for reloading data does not pop up and the search string
    // can be bookmarked, etc.)
    if(searchForm !== null) {
        searchForm.method = "get";
    }
}