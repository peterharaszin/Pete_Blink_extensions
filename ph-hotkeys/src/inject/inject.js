chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      // ----------------------------------------------------------
      // This part of the script triggers when page is done loading
      console.log("PH! hotkeys! :) (scripts/inject.js)");
      // ----------------------------------------------------------

//    console.log("Changing textarea classes...");
//    var textareaClassList = document.querySelector('textarea[name="content"]').classList;
//    // legyen ugyanolyan a háttérszíne, mint a végső...
//    // forum_5242.css: .msgblk .msg{margin:0;padding:0;background-color:#dfd9c3}
//    textareaClassList.add('msgblk');
//    textareaClassList.add('msg');
//    // NEM jó, mert felülbírálja az .input div.full textarea {... background-color: #f4f3ed; ... } a popup_3cea.css

      documentLoadedHandler();
    }
  }, 10);
});