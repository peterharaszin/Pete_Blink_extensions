// ==UserScript==
// @name          prohardver.hu : forum : hotkeys in editor
// @namespace     http://www.prohardver.hu/
// @include       http://www.prohardver.hu/muvelet/*
// @include       http://prohardver.hu/muvelet/*
// @include       http://www.mobilarena.hu/muvelet/*
// @include       http://mobilarena.hu/muvelet/*
// @include       http://www.logout.hu/muvelet/*
// @include       http://logout.hu/muvelet/*
// @include       http://www.itcafe.hu/muvelet/*
// @include       http://itcafe.hu/muvelet/*
// @include       http://www.gamepod.hu/muvelet/*
// @include       http://gamepod.hu/muvelet/*
// @include       http://www.bitmarket.hu/muvelet/*
// @include       http://bitmarket.hu/muvelet/*
// @include       http://www.hardverapro.hu/muvelet/*
// @include       http://hardverapro.hu/muvelet/*
// @version       1.4
// ==/UserScript==

console.log('PH hotkeys from dqdb');

function hasClass(ele,cls) {
  return !!ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

function addClass(ele,cls) {
  if (!hasClass(ele,cls)) ele.className += " "+cls;
}

function removeClass(ele,cls) {
  if (hasClass(ele,cls)) {
    var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
    ele.className=ele.className.replace(reg,' ');
  }
}

function toggleClass(ele, cls) {
  if (hasClass(ele,cls)) {
    removeClass(ele,cls);
  } else {
    addClass(ele,cls);
  }
}

function hotkeyContainerClickedHandler(e) {
  var hotkeyContainer = e.currentTarget;
  toggleClass(hotkeyContainer, "collapsed");
  // console.log('HotkeyC clicked: ', e.target, " e.curr: ", , ", e: ", e);
}

/**
 * Úgy nézem, csak annyi a különbség a userscripts.org-os változathoz képest, hogy 
 * itt már a közös keylib-et használom. Az előző változat még ment Opera, FF és Chrome alatt is, 
 * ez passz, csak Opera alatt néztem. A forrásszöveg végén szépen látszanak a billentyűkombinációk.
 * 
 * @see http://prohardver.hu/tema/opera_bongeszo_2/hsz_19029-19029.html
 * még jól jöhet: http://www.openjs.com/scripts/events/keyboard_shortcuts/
 */
function documentLoadedHandler(e)
{
  var isNewTopic = (window.location.pathname === "/muvelet/tema/uj.php");

  // TODO: új Hardveraprón nem jó! (Több textarea is lehet)
  // példa: http://hardverapro.hu/apro/kulfoldi_billentyus_a_laptopod_magyart_akarsz_megoldom_ors
  var editorXPath = !isNewTopic ? "//textarea[@name=\"content\"]" : "//textarea[@name=\"msg_content\"]";
  var editor = document.evaluate(editorXPath, document.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  if (editor === null) {
    return;
  }

  // http://www.oreillynet.com/pub/a/javascript/excerpts/javascript-tdg/client-side-javascript-reference.html

  // TODO: bitmarket.hu-n nem jó, ott az első elem NEM radio box (hanem a rating; OFF-lehetőség nincs is)
  // példa: http://bitmarket.hu/muvelet/termek_velemeny/modosit.php?prdid=18661
//  var buttons = document.evaluate("//input", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  var buttons = document.evaluate("//input[@type='button']", document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  var submitButton = document.evaluate("//input[@type='submit' and @value='OK']", document.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  var offTopicRadioButtons = document.evaluate("//input[@type='radio' and @name='offtopic']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  /*
   var first_input_element = buttons.snapshotItem(0);
   var is_comment = first_input_element.type === "radio" && first_input_element.name === "offtopic";
   // http://logout.hu/muvelet/teszt/uj.php
   var is_logout_test = first_input_element.type === "text" && first_input_element.name === "author" && buttons.snapshotItem(1).type === "checkbox";
   // http://logout.hu/muvelet/bejegyzes/uj.php
   var is_logout_blogpost = first_input_element.type === "text" && first_input_element.name === "title";
   // http://logout.hu/muvelet/bejegyzes/uj.php --> buttons.snapshotItem(1) a félkövér
   // http://logout.hu/muvelet/teszt/uj.php --> buttons.snapshotItem(4) a félkövér
   // privátnál: buttons.snapshotItem(1)
   */

//  var n = is_comment ? 2 : 0;
  var n = 0;
  var hotkeys =
          {
//            "ctrl-enter": buttons.snapshotItem(n++), // send comment
            "ctrl-enter": submitButton, // send comment
            //"ctrl-s" : ":)",
            //"ctrl-x" : function() { window.alert("pressed"); },
            "ctrl-b": buttons.snapshotItem(n++), // bold
            "ctrl-i": buttons.snapshotItem(n++), // italic
            "ctrl-u": buttons.snapshotItem(n++), // underlined
            "ctrl-s": buttons.snapshotItem(n++), // strike-through
            "ctrl-o": buttons.snapshotItem(n++), // off topic
            // "ctrl-k": buttons.snapshotItem(n++), // link
            "ctrl-l": buttons.snapshotItem(n++), // link
            "ctrl-g": buttons.snapshotItem(n++), // image
            // "ctrl-d": buttons.snapshotItem(n++), // code
            "ctrl-k": buttons.snapshotItem(n++), // code
            "ctrl-m": buttons.snapshotItem(n++), // monospace
            "ctrl-w": buttons.snapshotItem(n++), // raw
//    "ctrl-p": buttons.snapshotItem(n++), // paragraph // MOD??? már nincs ilyen
            // "ctrl-l": buttons.snapshotItem(n++), // left-aligned
            "ctrl-d": buttons.snapshotItem(n++), // left-aligned
            "ctrl-r": buttons.snapshotItem(n++), // right-aligned
            "ctrl-e": buttons.snapshotItem(n++), // centered
            "ctrl-j": buttons.snapshotItem(n++)  // justified
          };

  var isLogoutPage = window.location.host === 'logout.hu';
  if (isLogoutPage) {
    var isLogoutBlogTestEditing = window.location.pathname === "/muvelet/teszt/uj.php";
    var isLogoutBlogPostEditing = window.location.pathname === "/muvelet/bejegyzes/uj.php";
    console.log('Logout-oldal');
    console.log('isLogoutBlogTestEditing: ', isLogoutBlogTestEditing, ' isLogoutBlogPostEditing: ', isLogoutBlogPostEditing);

    if (isLogoutBlogTestEditing) { // csak tesztnél van "Oldal" gomb
      hotkeys["ctrl-alt-p"] = buttons.snapshotItem(n++); // Page    
    }

    if (isLogoutBlogTestEditing || isLogoutBlogPostEditing) { // csak tesztnél és bejegyzésnél van "YouTube" gomb
      hotkeys["ctrl-y"] = buttons.snapshotItem(n++); // YouTube
    }

  }

//  if (is_comment)
  if (offTopicRadioButtons.snapshotLength !== 0)
  {
    hotkeys["ctrl-alt-n"] = offTopicRadioButtons.snapshotItem(0); // normal comment
    hotkeys["ctrl-alt-o"] = offTopicRadioButtons.snapshotItem(1); // off-topic comment
  }

  console.log('hotkeys: ', hotkeys);
  
  var hotkeyContainer = document.createElement('div');
  hotkeyContainer.className = "collapsed";
  hotkeyContainer.setAttribute('id', 'hotkey-help');
  var hotkeyImageContainer = document.createElement('div');
  hotkeyImageContainer.className = "text-right";
  var hotkeyImage = document.createElement('img');
  hotkeyImage.className = "pointer";
  // https://cdn3.iconfinder.com/data/icons/fugue/icon/information-balloon.png
  var logoUrl = chrome.extension.getURL("icons/information-balloon.png");
  console.log("logoUrl: ", logoUrl);
  hotkeyImage.setAttribute('src', logoUrl);
  hotkeyImage.setAttribute('alt', "information balloon");
  var hotkeyHelpSection = document.createElement('section');
  var hotkeyHelpSectionTitle = document.createElement('h5');
  hotkeyHelpSectionTitle.textContent = "Billentyűparancsok";
  var ul = document.createElement('ul');
  ul.className = "left";
  document.body.appendChild(hotkeyContainer);
  hotkeyContainer.appendChild(hotkeyImageContainer);
  hotkeyImageContainer.appendChild(hotkeyImage);
  hotkeyContainer.appendChild(hotkeyHelpSection);
  hotkeyHelpSection.appendChild(hotkeyHelpSectionTitle);
  hotkeyHelpSection.appendChild(ul);

  hotkeyContainer.addEventListener("click", hotkeyContainerClickedHandler, false);
  
  for (var hotkey in hotkeys) {
    if (hotkeys.hasOwnProperty(hotkey)) {
      var li = document.createElement('li');
      ul.appendChild(li);
//    li.innerHTML=li.innerHTML + array[i];
      li.innerHTML = ((hotkey+"").toUpperCase() + " -> " + hotkeys[hotkey].value);
    }
  }

  keylib_initialize(editor, hotkeys);
}

//if (document.body) {
//  documentLoadedHandler();
//}
//else {
//  window.addEventListener("load", documentLoadedHandler, false);
//}


//////////////////////////////////////////
// 1.4 keylib
// 1.3 FF4 kompatibilitás
// 1.2 Chrome kompatibilitás
// 1.1 privát írásakor elcsúszott a billentyűkiosztás
// 1.0 eredeti változat