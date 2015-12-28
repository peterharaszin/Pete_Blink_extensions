// // Copyright (c) 2011 The Chromium Authors. All rights reserved.
// // Use of this source code is governed by a BSD-style license that can be
// // found in the LICENSE file.

// // Called when the user clicks on the browser action.
// chrome.browserAction.onClicked.addListener(function(tab) {
  // // No tabs or host permissions needed!
  // console.log('Turning ' + tab.url + ' red!');
  // chrome.tabs.executeScript({
    // code: 'document.body.style.backgroundColor="red"'
  // });
// });

console.log('General Blink extension, background.js');

var urlsToBlock = [
  // removing the ugly Lenovo marketing stylesheet from Prohardver's main site
  '*://prohardver.hu/dl/css/lenovo.css'
];

function blockRequest(details) {
  return {cancel: true};
}

/**
 * @see http://stackoverflow.com/questions/15765451/chrome-extension-to-efficiently-block-domains/15765714#15765714
 */
function updateFilters(urlsToBlock) {
  if(chrome.webRequest.onBeforeRequest.hasListener(blockRequest))
    chrome.webRequest.onBeforeRequest.removeListener(blockRequest);
  chrome.webRequest.onBeforeRequest.addListener(blockRequest, {urls: urlsToBlock}, ['blocking']);
}

updateFilters(urlsToBlock);