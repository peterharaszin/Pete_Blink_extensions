// ==UserScript==
// @include	   http://prohardver.hu/*
// @include	   http://mobilarena.hu/*
// @include	   http://itcafe.hu/*
// @include	   http://logout.hu/*
// ==/UserScript==

/**
 * Ez egy közös library hotkey-k bekötésére. Adott billentyűzetkombinációhoz egy callbacket, 
 * szöveget, egy linkre/gombra kattintást tudsz hozzárendelni. Azért dobtam ki külső forrásba, 
 * hogy majd több oldalra csinálok magamnak saját billentyűkiosztást, de nem sokáig jutottam :)
 * @see http://prohardver.hu/tema/opera_bongeszo_2/hsz_19029-19029.html
 * 
 * @param {object} obj Blablabla
 * @param {object} hotkeys Blablabla
 * 
 * @todo null vagy undefined közötti inkonzisztenciák feloldása: 
 *        http://stackoverflow.com/questions/461966/why-is-there-a-null-value-in-javascript
 */
function keylib_initialize(obj, hotkeys)
{
//	obj.hotkey = null;
////	if (obj == null)
//	if (obj === undefined)
//		return;
  if (obj == null) {
    return;
  }
  obj.hotkey = null;

  var onhotkeycancel = function(e)
  {
    e.returnValue = false;
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    if (e.preventDefault) {
      e.preventDefault();
    }
    return false;
  };

  var onhotkeypress = function(e)
  {
    if (obj.hotkey === null) {
      return true;
    }

    var hotkey = obj.hotkey;
    if (typeof (hotkey) === "function") {
      hotkey(e);
    }
    else if (typeof (hotkey) === "string" && typeof (obj) === "object" && obj.tagName === "TEXTAREA") {
      obj.value = obj.value.substr(0, obj.selectionStart) + hotkey + obj.value.substr(obj.selectionEnd);
    }
    else if (typeof (hotkey) === "object" && (hotkey.tagName === "INPUT" || hotkey.tagName === "A")) {// && window.opera == null)
      hotkey.click();
    }

    return onhotkeycancel(e);
  };

  var onhotkeydown = function(e)
  {
    var code = e.keyCode ? e.keyCode : e.which;
//		if (code == null)
    if (code === undefined)
      return true;

    var named_keys =
            {
              8: "backspace", 9: "tab", 13: "enter", 32: "space", 27: "esc",
              33: "pageup", 34: "pagedown", 35: "end", 36: "home",
              37: "left", 38: "up", 39: "right", 40: "down",
              45: "insert", 46: "delete",
              112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6",
              118: "f7", 119: "f8", 120: "f9", 121: "f10", 122: "f11", 123: "f12"
            };

    var key =
            (e.ctrlKey ? "ctrl-" : "") + (e.altKey ? "alt-" : "") + (e.shiftKey ? "shift-" : "");
    if ((code >= 65 && code <= 90) || (code >= 48 && code <= 57))
      key += String.fromCharCode(code).toLowerCase();
//		else if (named_keys[code] == null)
    else if (named_keys[code] === undefined)
      return true;
    else
      key += named_keys[code];

    obj.hotkey = hotkeys[key];
//		if (obj.hotkey == null)
    if (obj.hotkey === undefined)
      return true;

    return onhotkeypress(e);
  };

  var onhotkeyup = function(e)
  {
//		if (obj.hotkey == null)
    if (obj.hotkey === undefined) {
      return true;
    }

    obj.hotkey = null;
    return onhotkeycancel(e);
  };

  obj.addEventListener("keydown", onhotkeydown, false);
  obj.addEventListener("keyup", onhotkeyup, false);
}
